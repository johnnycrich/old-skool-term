//               _                                                                     .         
//     .    __.  /      , __   , __   ,    .         ___    __.  , __     ____   __.   |     ___ 
//     \  .'   \ |,---. |'  `. |'  `. |    `       .'   ` .'   \ |'  `.  (     .'   \  |   .'   `
//     |  |    | |'   ` |    | |    | |    |       |      |    | |    |  `--.  |    |  |   |----'
// /`  |   `._.' /    | /    | /    |  `---|.       `._.'  `._.' /    | \___.'  `._.' /\__ `.___,
// \___/`                              \___/                                                     
// A basic JS/jQuery-driven in-window javascript console in the vein of iTerm/OSX Terminal.

var Console = function() {
  
  var TILDE_KEY = 96;
  var ENTER_KEY = 13;
  var LEFT_KEY = 39;
  var RIGHT_KEY = 37;
  var UP_KEY = 38;
  var DOWN_KEY = 40;
  var BACKSPACE_KEY = 8;

  var scrollback = [];
  var scrollbackIndex = 0;

  var mainSelector;
  var textBoxSelector;

  this.generate = function(begin) {

     try {

       var result = eval(textBoxSelector.val());

       mainSelector.append(function() {
           if(result !== undefined) {
              return $("<div class='result'>" + result + "</div>")
                      .click(function() {
                          self.displayInput($(this).text(), true);

                          textBoxSelector.val($(this).text());
                          textBoxSelector.focus();
                      });
           }
       });
     
     } 
     catch(err) {

       mainSelector.append($("<div class='error'>" + err + "</div>"));
     
     }

     $('span.cursor').hide();

     var newLine = $("<div/>", {
                       class: "bash"
                   });
     var newCursor = $("<span/>", {
                           class: "cursor"
                       });

     $(newLine).prepend("johnnybash$");
     $(newCursor).text('_');

     mainSelector.append( $("<div/>") )
     .append( newLine )
     .append( $("<div/>", {
                class: "line"
              })
     )
     .append( newCursor );

     if(textBoxSelector.val().length > 0)
     {
      scrollback.push(textBoxSelector.val());
      scrollbackIndex = scrollback.length;
     }

     textBoxSelector.val('');

  };

  this.displayInput = function(inputText, append) {
    
    if(append === undefined || !append)
        $('#console .line:last').text(inputText);
    else
        $('#console .line:last').text($('#console .line:last').text() + inputText);

  };

  this.scrollbackGo = function(back) {

    var input = "";

    if(back)
    {
      if(scrollbackIndex > 0) scrollbackIndex--;
      
      input = scrollback[scrollbackIndex];
    }
    else
    {
      if(scrollbackIndex < scrollback.length) {
        scrollbackIndex++;
        input = scrollback[scrollbackIndex];
      }

    }
    
     self.displayInput(input);
     textBoxSelector.val(input);

  };
 
  this.listeners = function() {

      textBoxSelector
      .on('input propertychange paste', function() {

          self.displayInput(textBoxSelector.val());

      })
      .keydown(function() {

        if ( event.which == LEFT_KEY && (parseInt($('#console .cursor').css('left').replace('px', '')) < -10) )
           $('#console .cursor').css('left', '+=8px');
        else if ( event.which == RIGHT_KEY )
           $('#console .cursor').css('left', '-=8px');
        else if ( event.which == UP_KEY )
          self.scrollbackGo(true);
        else if ( event.which == DOWN_KEY )
          self.scrollbackGo();
        else if ( event.which == BACKSPACE_KEY )
          self.displayInput(textBoxSelector.val());
        else if ( event.which == ENTER_KEY )
           self.generate();

      });

      textBoxSelector.focus();

  };

  $('body').prepend($('<textarea />', {id: "console_text"}));
  $('body').prepend($('<div />', {id: "console"}));

  mainSelector = $('#console');
  textBoxSelector = $('#console_text');

  $(window).keypress(function() {

    if ( event.which == TILDE_KEY ) {
       event.preventDefault();
       mainSelector.toggleClass("open");

       if(mainSelector.hasClass("open"))
          textBoxSelector.focus();
    }

  });

  mainSelector.click(function() { textBoxSelector.focus(); });

  this.generate(true);
  this.listeners();

};