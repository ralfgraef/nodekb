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

  $('.checkbox').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    const did = $target.attr('id');
    $.ajax({
      type: 'PUT',
      url:'/articles/edit_check/' + id + '/' + did,
      success: function(response) {
        window.location.href='/articles/' + id;
        console.log('Asikopp!!!');
      },
      error: function(err) {
        console.log(err); 
      }
    });

  });
  
});