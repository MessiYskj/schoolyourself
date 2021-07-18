function SchoolYourselfReviewStudentView(runtime, element) {
  var viewport = schoolyourself.PlayerViewportBuilder.insert(1024, 768);
  $(function ($) {
    $('.schoolyourself-lesson-player', element).click(function(eventObject) {
      viewport.openFrame(this.getAttribute('data-url'));
    });

    window.addEventListener('message', function(event) {
      if (event.source != viewport.frame().contentWindow) {
        return;
      }
      var handlerUrl = runtime.handlerUrl(element, 'handle_grade');
      $.post(handlerUrl, JSON.stringify(event.data));
    }, false);
  });

  updateMastery();
  viewport.addAfterCloseHandler(updateMastery);
}

function renderMastery(masteries) {
  var mastery = masteries[0][1];
  if (!mastery) {
    return;
  }

  var scaledMastery = Math.min(mastery / 0.7, 1);
  var right = (100 - (scaledMastery * 100)) + '%';

  $('.schoolyourself-review-mastery').css('opacity', 1);

  if (mastery < 0.35) {
    var text = 'Keep practicing!';
    var color = '#fcd380';
  } else if (mastery < 0.7) {
    var text = 'Almost there!';
    var color = '#f0b300';
  } else if (mastery < 1) {
    var text = 'Complete!';
    var color = '#6eb535';
  } else {
    var text = 'Mastered!';
    var color = '#6eb535';
  }

  $('.schoolyourself-review-mastery-text').html(text);
  $('.schoolyourself-review-mastery-bar-filler').css('right', right);
  $('.schoolyourself-review-mastery-bar-filler').css('background', color);
}

function updateMastery() {
  var args = $.parseJSON($('.xblock_json_init_args').html());
  var url = args['mastery_url'];

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.withCredentials = true;
  xhr.send();
  xhr.onreadystatechange = function(event) {
    if (xhr.readyState === 4 &&
        xhr.status === 200) {
      renderMastery($.parseJSON(xhr.responseText));
    }
  };
}
