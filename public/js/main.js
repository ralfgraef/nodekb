$(document).ready(function() {

  if (document.querySelector('.alert')){
    console.log('Ist da!')
    $('.alert').fadeOut(5000);
  }
  $('.delete-article').on('click', function(e){
    $target = $(e.target);
    console.log($target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url:'/article/' + id,
      success: function(response) {
        alert('Deleting Article');
        window.location.href='/'
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});