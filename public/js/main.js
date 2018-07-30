$(document).ready(function() {

  if (document.querySelector('.alert')){
    $('.alert').fadeOut(5000);
  }
  $('.delete-article').on('click', function(e){
    if(confirm('Bist Du sicher?')) {
      $target = $(e.target);
      console.log('$target: ', $target);
      const id = $target.attr('data-id');
      $.ajax({
        type: 'DELETE',
        url:'/articles/' + id,
        success: function(response) {
          window.location.href='/'
        },
        error: function(err) {
          console.log(err);
        }
      });
    }; 
  });

});