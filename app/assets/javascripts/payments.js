
var ready;
ready = function() {



	console.log('payments.js working');
$('form.quarter_billing_form #billing_for').val("");
$('form.quarter_billing_form #beg_quarter_date').datepicker({dateFormat :'yy-mm-dd'}).val("2017-10-20");
$('form.quarter_billing_form #end_quarter_date').datepicker({dateFormat :'yy-mm-dd'}).val("2017-10-20");
$('form.quarter_billing_form').submit(function(e){
	alert('submit function');
                  e.preventDefault();
                    $.ajax({
                            type: 'get',
                            url:  '/payments/quarter_billing_save',
                            dataType: 'text',
                            data:  {billing_date: $('form.quarter_billing_form #beg_quarter_date').val(),
                                    billing_for: $('form.quarter_billing_form #billing_for').val()
                                    },
                            success: function(data){
                                      console.log('inside success');
                                      alert('inside success');
                                    } // end success
                    })  // end ajax call
                });  // end submit

};
$(document).ready(ready);
$(document).on('page:load', ready);  /// using torbolinks

 /// end document ready