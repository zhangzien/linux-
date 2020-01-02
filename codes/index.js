window.onload = function() {
   alert("支持鼠标点击,键盘输入,从中间插入删除\n除法和取余数均为浮点数运算\n前导0将视为8进制");
   history = document.getElementsByTagName('p')[0];
   exp = document.getElementById("exp");
   exp.value = history.value = "";
   last_click = false;  // whether last click is = or enter

   simple_click();
   adv_click();

   exp.onkeydown = function(event) { // whether press +-*/=Enter
      var key = event.keyCode,
         operator = [107,109,106,111,189,191];
      if (last_click && operator.indexOf(key) < 0) // if not +-*/
         exp.value = ""; // clear the result to input a new expression
      last_click = false;
      if (key == 13 && exp.value) // if press Enter,calc the result
         calc();
   }
   exp.oninput = function() {
      var len = exp.value.length,
         lastch = exp.value[len - 1];
      while (lastch >= 'a' && lastch <= 'z' || lastch >= 'A' && lastch <= 'Z' || escape(exp.value).indexOf("%u") >= 0) {
         exp.value = exp.value.substring(0, len - 1);
         len = exp.value.length;
         lastch = exp.value[len - 1]; //disallow input english and chinese
      }
      if (lastch == '=') {
         exp.value = exp.value.substring(0, exp.value.length - 1);
         calc();
      }
   }
}

function simple_click () {
   var simple_btn = document.getElementById("simple").getElementsByTagName("input"); // get all simple buttons

   for (var i = 0; i < simple_btn.length; i++) {
      simple_btn[i].onclick = function() {
         if (last_click && this.value === "←") {
            exp.focus();
            return;
         }
         if (last_click && ('+-*/%'.indexOf(this.value) < 0)) {
            exp.value = "";
         }  // if not click +-*/%, clear the result to input a new expression
         last_click = false;
         if (this.value === "↑") { //show last expression
            exp.value = history.value;
            exp.focus();
         }
         else if (this.value === "←") { // erase the last char
            var sPos = exp.selectionStart,
            s = exp.value;
            exp.value = s.substring(0, sPos - 1) + s.substring(sPos, s.length);
            exp.focus();
            exp.selectionStart = exp.selectionEnd = sPos - 1; // move cursor
         }
         else if (this.value === "CE") { // clear expression
            exp.value = "";
            exp.focus();
         }
         else if (this.value === "=") { // calc the result
            if (exp.value)
               calc();
            exp.focus();
         }
         else {
            var sPos = exp.selectionStart,
               s = exp.value,
               btn = this.value;
            exp.value = s.substring(0, sPos) + btn + s.substring(sPos, s.length);
            exp.focus();
            exp.selectionStart = exp.selectionEnd = sPos + 1;
            if (btn === "00")
               exp.selectionStart = exp.selectionEnd = sPos + 2;
         }
      };
   }
}

function adv_click () {
   var adv_btn = document.getElementById("advanced").getElementsByTagName("input");  // get all advanced buttons
   for (var i = 0; i < adv_btn.length; i++) {
      adv_btn[i].onclick = function() {
         if (last_click) {
            exp.value = "";
            last_click = false;
         }

         var sPos = exp.selectionStart,
            cursorPos = sPos,
            s = exp.value,
            btn = this.value.substr(0, this.value.indexOf('x'));
         exp.value = s.substring(0, sPos) + btn + s.substring(sPos, s.length);
         exp.focus();
         exp.selectionStart = exp.selectionEnd = sPos + btn.length;
      };
   }
}

function changeMode (id) { // change the mode between simple and advanced
   if (id === "mode2") {
      document.getElementById("mode1").id = "tmp";
      document.getElementById("mode2").id = "mode1";
      document.getElementById("tmp").id = "mode2";

      var mode = document.getElementById("mode1").value,
      advanced = document.getElementById("advanced");
      document.getElementsByTagName('h1')[0].innerHTML = mode + "计算器";
      if (mode === "高级")
        advanced.style["display"] = "block";
      else
         advanced.style["display"] = "none";
      exp.focus();
   }
}

function calc () { // calc the result
   try {
      last_click = true;
      history.value = exp.value,
      document.getElementsByTagName('p')[0].innerHTML = history.value;
      var reg = new RegExp("[a-z]{2,}", "g"),
         res = exp.value.match(reg); //regular expression to find function name
      if (exp.value.indexOf("//") >= 0 || exp.value.indexOf("*/") >= 0)
         throw "Invalid"; //If use eval, // and /**/ will be comment
      if (res != null) {  // replace function name xxx with Math.xxx
         res.sort();
         while (res.length) {
            reg = RegExp(res[0], "g");
            exp.value = exp.value.replace(reg, "Math." + res[0]);
            res.splice(0, res.lastIndexOf(res[0]) + 1);
         }
      }
      res = parseFloat(eval(exp.value).toFixed(10));
      if (isNaN(res) || Math.abs(res) == Infinity || res == undefined) {
         throw "invalid";
      }
      exp.value = res;
      exp.focus();
   }

   catch (exception) { // invalid input
      alert("表达式非法,请重新输入");
      document.getElementsByTagName('p')[0].innerHTML += " 格式非法";
      exp.value = "";
      exp.focus();
   }
}
