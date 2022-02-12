function deselect(e) {
    $('.pop').slideFadeToggle(function() {
      e.removeClass('selected');
    });    
  }
  
  $(function() {
    $('.desktop_contact, .hamburger_contact').on('click', function() {
      if($(this).hasClass('selected')) {
        deselect($(this));               
      } else {
        $(this).addClass('selected');
        $('.pop').slideFadeToggle();
      }
      return false;
    });
  
    $('.close').on('click', function() {
      deselect($('#contact1, #contact2'));
      return false;
    });
  });
  
  $.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
  };