 //               _                                                                     .         
 //     .    __.  /      , __   , __   ,    .         ___    __.  , __     ____   __.   |     ___ 
 //     \  .'   \ |,---. |'  `. |'  `. |    `       .'   ` .'   \ |'  `.  (     .'   \  |   .'   `
 //     |  |    | |'   ` |    | |    | |    |       |      |    | |    |  `--.  |    |  |   |----'
 // /`  |   `._.' /    | /    | /    |  `---|.       `._.'  `._.' /    | \___.'  `._.' /\__ `.___,
 // \___/`                              \___/                                                     

var Console = Console || {};

Console.enterKey = 13;
Console.leftKey = 39;
Console.rightKey = 37;
Console.backspaceKey = 8;

Console.init = function() {

   $(window).keypress(function() {
      if ( event.which == 96 ) {
         event.preventDefault();
         $('#console').toggleClass("open");

         if($("#console").hasClass("open"))
            $('#console_text').focus();
      }
   });

   $('body').prepend($('<textarea />', {id: "console_text"}));
   $('body').prepend($('<div />', {id: "console"}));

   Console.generate(true);
   Console.listeners();

};

Console.generate = function(begin){

   if(begin !== undefined || !begin)
   {
      // $('#console').html(
      //  "               _                                                                     .         <br />" +
      //  "     .    __.  /      , __   , __   ,    .         ___    __.  , __     ____   __.   |     ___ <br />" +
      //  "     \  .'   \ |,---. |'  `. |'  `. |    `       .'   ` .'   \ |'  `.  (     .'   \  |   .'   `<br />" +
      //  "     |  |    | |'   ` |    | |    | |    |       |      |    | |    |  `--.  |    |  |   |----'<br />" +
      //  " /`  |   `._.' /    | /    | /    |  `---|.       `._.'  `._.' /    | \___.'  `._.' /\__ `.___,<br />" +
      //  " \___/`                              \___/                                                     ".replace(/\s/g, '&nbsp;')
      // );
   }

   try {
     var result = undefined;

     // if($('#console_text').val().indexOf('var') != -1)
     //  this[$('#console_text').val()]

     result = eval($('#console_text').val());

     $("#console").append(function() {
         if(result != undefined) {
            return $("<div class='result'>" + result + "</div>")
                    .click(function() {
                        Console.displayInput($(this).text(), true);
                    });
         }
     });
   } 
   catch(err) {
     $("#console").append($("<div class='error'>" + err + "</div>"));
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

   $("#console")
   .append(
     $("<div/>")
   )
   .append(
     newLine
   )
   .append(
     $("<div/>", {
         class: "line"
     })
   )
   .append(
     newCursor
   );

   $('#console_text').val('');

};

Console.displayInput = function(inputText, append) {
    if(append === undefined || !append)
        $('#console .line:last').text(inputText);
    else
        $('#console .line:last').text($('#console .line:last').text() + inputText);
};

Console.listeners = function() {

    $('#console_text')
    .on('input propertychange paste', function() {
        Console.displayInput($('#console_text').val());
    })
    .keydown(function() {
       // alert( event.which );
      if ( event.which == Console.leftKey && (parseInt($('#console .cursor').css('left').replace('px', '')) < -10) )
         $('#console .cursor').css('left', '+=8px');
      else if ( event.which == Console.rightKey )
         $('#console .cursor').css('left', '-=8px');
      else if ( event.which == Console.backspaceKey )
        Console.displayInput($('#console_text').val());
      else if ( event.which == Console.enterKey )
         Console.generate();
    });

    $('#console').focus(moveToEnd).click(moveToEnd);
    $('#console_text').focus();

};