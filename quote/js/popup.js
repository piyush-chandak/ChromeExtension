$(document).ready(function(){
  const QUOTE_URL = 'https://type.fit/api/quotes';
  const hiddenClass = 'hidden';
  const disabledClass = 'disabled';
  const clickAction = 'click';
  const $quote = $('#quote');
  const $fetching = $('.fetching');
  const $error = $('.error');
  const $refreshBtn = $('.refresh-btn');
  const $link = $('.link');

  var cacheQuotes = null;

  fetchQuote();

  $refreshBtn.off(clickAction).on(clickAction, function() {
    fetchQuote();
  });

  $link.off(clickAction).on(clickAction, function() {
    const navigationLink = $(this).data('navigation-link');
    if (navigationLink) {
      navigateTo(navigationLink);
    }
  });

  function fetchQuote() {
    if (cacheQuotes) {
      updateQuoteHTML(cacheQuotes);
    } else {
      $quote.addClass(hiddenClass);
      $error.addClass(hiddenClass);
      $fetching.removeClass(hiddenClass);
      $refreshBtn.addClass(disabledClass);

      fetch(QUOTE_URL)
      .then((response) => {
        response.json().then(function(data) {
          cacheQuotes = data;

          updateQuoteHTML(data);
          $quote.removeClass(hiddenClass);
          $refreshBtn.removeClass(disabledClass);
          $fetching.addClass(hiddenClass);
        });
      })
      .catch(() => {
        $error.removeClass(hiddenClass);
        $refreshBtn.removeClass(disabledClass);
        $fetching.addClass(hiddenClass);
      });
    }
  }

  function updateQuoteHTML(quotes) {
    const index = randomGenerateIndex(quotes.length);
    const quoteHTML = formatToHtml(quotes[index]);
    $quote.html(quoteHTML);
  }

  function formatToHtml(quote) {
    let htmlArray = [];
    htmlArray.push(`<p class="strong">${quote.text}</p>`);
    if (!quote.author) {
      quote.author = 'Anonymous';
    }
    htmlArray.push(`<p class="author">- ${quote.author}</p>`);
    return htmlArray.join('');
  }

  function randomGenerateIndex(limit) {
    return Math.floor(Math.random() * limit);
  };

  function navigateTo(link){
    chrome.tabs.create({ url: link });
  }
});