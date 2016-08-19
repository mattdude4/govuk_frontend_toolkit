;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  function ShowHideContent () {
    var self = this

    var $els = $('.js-toggle-showhide')

    if ($els.length > 0) {
      var namespace = 'ShowHideContent'
      var radioSelector = '.block-label input[type="radio"]'
      var checkboxSelector = '.block-label input[type="checkbox"]'
    } else {
      console.log('parent class .js-toggle-showhide is missing')
    }

    // Escape name attribute for use in DOM selector
    function escapeElementName (str) {
      var result = str.replace('[', '\\[').replace(']', '\\]')
      return (result)
    }

    // Adds ARIA attributes to control + associated content
    function initToggledContent () {
      var $control = $(this)
      var $content = getToggledContent($control)

      // Set aria-controls and defaults
      if ($content.length) {
        $control.attr('aria-controls', $content.attr('id'))
        $control.attr('aria-expanded', 'false')
        $content.attr('aria-hidden', 'true')
      }
    }

    // Return toggled content for control
    function getToggledContent ($control) {
      var id = $control.attr('aria-controls')

      // ARIA attributes aren't set before init
      if (!id) {
        id = $control.parent('label').data('target')
      }

      // Find show/hide content by id
      return $('#' + id)
    }

    // Show toggled content for control
    function showToggledContent ($control, $content) {

      // Show content
      if ($content.hasClass('js-hidden')) {
        $content.removeClass('js-hidden')
        $content.attr('aria-hidden', 'false')

        // If the controlling input, update aria-expanded
        if ($control.attr('aria-controls')) {
          $control.attr('aria-expanded', 'true')
        }
      }
    }

    // Hide toggled content for control
    function hideToggledContent ($control, $content) {
      $content = $content || getToggledContent($control)

      // Hide content
      if (!$content.hasClass('js-hidden')) {
        $content.addClass('js-hidden')
        $content.attr('aria-hidden', 'true')

        // If the controlling input, update aria-expanded
        if ($control.attr('aria-controls')) {
          $control.attr('aria-expanded', 'false')
        }
      }
    }

    // Handle radio show/hide
    function handleRadioContent ($control, $content) {

      // All radios in this group
      var selector = radioSelector + '[name=' + escapeElementName($control.attr('name')) + ']'
      var $radios = $control.closest('form').find(selector)

      // Hide radios in group
      $radios.each(function () {
        hideToggledContent($(this))
      })

      // Select radio button content
      showToggledContent($control, $content)
    }

    // Handle checkbox show/hide
    function handleCheckboxContent ($control, $content) {

      // Show checkbox content
      if ($control.is(':checked')) {
        showToggledContent($control, $content)
      }

      // Hide checkbox content
      else {
        hideToggledContent($control, $content)
      }
    }

    // Set up event handlers etc
    function init ($container, selector, handler) {
      $container = $container || $(document.body)

      // Handle control clicks
      function deferred () {
        var $control = $(this)
        handler($control, getToggledContent($control))
      }

      // Prepare ARIA attributes
      var $controls = $(selector)
      $controls.each(initToggledContent)

      // Handle events
      $container.on('click.' + namespace, selector, deferred)

      // Any already :checked on init?
      if ($controls.is(':checked')) {
        $controls.filter(':checked').each(deferred)
      }
    }

    // Set up radio show/hide content for container
    self.showHideRadioToggledContent = function ($container) {
      init($container, radioSelector, handleRadioContent)
    }

    // Set up checkbox show/hide content for container
    self.showHideCheckboxToggledContent = function ($container) {
      init($container, checkboxSelector, handleCheckboxContent)
    }

    // Remove event handlers
    self.destroy = function ($container) {
      $container = $container || $(document.body)
      $container.off('.' + namespace)
    }
  }

  ShowHideContent.prototype.init = function ($container) {
    this.showHideRadioToggledContent($container)
    this.showHideCheckboxToggledContent($container)
  }

  GOVUK.ShowHideContent = ShowHideContent
  global.GOVUK = GOVUK
})(window)
