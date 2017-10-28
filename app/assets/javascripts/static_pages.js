$(function() {
    // document ready function

///////////////////////////////////////////////////////////  
///////////////// tags-v1 autocomplete search ///////////////////////
/////////////////////////////////////////////////////

$("#tags-v1").autocomplete({
    source: function(request,response){
      $.ajax({
        url: "/static_pages/home",
        dataType: "json",
        data: {term: request.term},

        success: function(data){
          console.log("tags1 data"+data);
          response(data);
        },
        error: function(data){
          console.log('error occured');
        }
      });// end of  ajax
    },
    minLength: 3,
    autoFocus: true,
    select: function( event, ui ) {
        $('#tags-v1').data({'address': ui.item.address, 'flat':ui.item.flat,
                            'prop':ui.item.label,'prop':ui.item.value, 
                            'postcode':ui.item.postcode,
                            'quarterly_cost':ui.item.quarterly_cost,
                            'cust_details' : ui.item.customers});
        /// save stair details to #tags-v1  ////

        $('#prop_address, #prop_id, #cust_details, #pymts, #cust_accounts').empty();
        $('#prop_address').append(ui.item.value);
        $('#prop_id').append(ui.item.id);
        $.ajax({
          url: '/static_pages/cust_accts',
          type: 'post',
          dataType: 'json',
          data : { data_value: ui.item.id},
          success: function(data){
            console.log('tags-v1    '+data.cust_a[0]);
            var arr1=data.cust_a;
            var pymt_count=[];
            var css_attr={ "color": "blue",
                           "font-weight":"bold",
                           "font-family":"verdana"};
            
            $.each(arr1,function(index, element){
              var closed="";
              if (element.acct_closed){closed="account closed"};
              $('#cust_accounts').append('<tr><td> '+element.name+
                ' </td> <td> '+insideAngleBrackets(element.email)+
                ' </td> <td> '+element.customer_id+
                ' </td> <td> '+closed+'</td></tr>');//+
                
              $('#cust_accounts tr').addClass('payment-hdr').css(css_attr);
            }) // end of $.each loop
            
            } // end of success:

        }) //end of ajax call

      } // end of select:

    });

///////////////////////////////////////				
				
//////////////////////////////////////////////////////////
      			//////////// new customer account//////////////
////////////////////////////////////////////////////////////

      			$('#new-customer-acct').click(function(){
      				console.log('new customer');
      				//console.log(data);
      				$('#modal_new_customer_acct_form').modal('show');
      				var addr=$('#prop_address').text();
      				var propid=$('#prop_id').text();
      				var id=parseInt(propid);
      				
      				$('#propadd').empty().append(addr+ " (property_id:  "+propid+")");
              $('form #new_name').val("");
              $('form #new_email').val("");
              $('form #new_start_date').datepicker({dateFormat :'yy-mm-dd'}).val("");
              $('form #new_bal_date').datepicker({dateFormat :'yy-mm-dd'}).val("");
      				$('form #propID').val(id);
      			})

      			$("#new_cust_acct").submit(function( event ) {
      				var url='/customers/new';
      				$.ajax({
      					type: 'post',
      					url: url,
      					data:  {myparam1: $('#new_cust_acct input:eq(0)').val(),
                        myparam2: $('#new_cust_acct input:eq(1)').val(),
                        myparam3: $('#new_cust_acct input:eq(2)').val(),
                        myparam4: $('#new_cust_acct input:eq(3)').val(),
                        myparam5: $('#new_cust_acct input:eq(4)').val(),
                        myparam6: $('#new_cust_acct input:eq(5)').val()
                        //myparam7: $('#new_cust_acct input:eq(6)').val()
                            
                            //authenticity_token: window._token
                            },
      					success: function(data)
      					{
      						console.log('inside success for new cust account');
                  //console.log( $( this ).serializeArray()); 
      					}
      				})

  				    //console.log('request:', $( this ).serializeArray() );
  				    event.preventDefault();
				    });
  ///////////////////////////////////////////////////
  
///////////////////////////////////////////////////////////
//  view customer accounts ///////////////////////////////
///////////////////////////////////////////////////////////
    $('#cust_accounts').on('click', 'tr.payment-hdr', function(e) {
        e.preventDefault();
        
        console.log('index',$(this).index());
        $('#tags-v1').data({'i_value': $(this).index()});
        var cust_ID=$(this).find('td:nth-of-type(3)').text();
        var cust_name=$(this).find('td:nth-of-type(1)').text();
        var cust_email=$(this).find('td:nth-of-type(2)').text();
        ///console.log(cust_ID);
          $.ajax({
                type: 'get',
                url: '/accounts/display',
                dataType: 'json',
                data:  {acct: cust_ID},
                success: function(data)
                {
                  var idx=$('#tags-v1').data().i_value;
                  $('#tabs-1Address').empty().append($('#tags-v1').data().prop);
                  console.log(data[0].bal);
                  $('#account_bal').empty().append(data[0].bal).css(css_attr);
                  $('#account_start_date').empty().append(data[0].start_date).css(css_attr);
                  $('#account_bal_date').empty().append(data[0].bal_date).css(css_attr);
                  $('#account_close_date').empty().append(data[0].close_date).css(css_attr);
                  $('form.edit_form #a_name').val(cust_name);
                  $('form.edit_form #a_email').val(cust_email);
                  $('form.edit_form #a_bal').val(data[0].bal);
                  $('form.edit_form #a_bal_date').datepicker({dateFormat :'yy-mm-dd'}).val(data[0].bal_date);
                  $('form.edit_form #a_start_date').datepicker({dateFormat :'yy-mm-dd'}).val(data[0].start_date);
                  $('form.edit_form #a_close_date').datepicker({dateFormat :'yy-mm-dd'}).val(data[0].close_date);
                  $('form.edit_form #accountIDInput').val(cust_ID);
                  $('form.edit_form #quarterCost').empty().val($('#tags-v1').data().cust_details[idx].quarter_cost);
                  console.log(data[0].acct_closed);
                  
                  if(data[0].acct_closed)
                    {$('#acctClosed').empty().append('Account Closed').css({'color':'red'});
                      $('#btnDeleteAcct').hide()}
                  else 
                    {$('#acctClosed').empty();
                    $('#btnDeleteAcct').show()};

                    var arr=data[0].payments;
                    var bal=data[0].bal;
                    
                    $('table.acctTable #acctTrans').empty();
                    $.each(arr,function(i,e){
                    $('table.acctTable #acctTrans').append('<tr><td> '+e.tdate+
                    ' </td> <td> '+e.amt+
                    ' </td> <td> '+e.trans+
                    ' </td></tr>');
                      if((e.transType==0| e.transType==null)&dateToInt(e.tdate)>dateToInt(data[0].bal_date))
                        {bal=bal-parseFloat(e.amt)}
                      if(e.transType==1 & dateToInt(e.tdate)>dateToInt(data[0].bal_date))
                        {bal=bal+parseFloat(e.amt)}
                      //console.log(dateToInt(data[0].bal_date));

                      //if(dateToInt(e.tdate)>dateToInt(data[0].bal_date))
                        //{console.log('date works')}
                    
                    })
                  
                    console.log('balance=',parseFloat(bal).toFixed(2));
                    $('#balance').empty().append(parseFloat(bal).toFixed(2));
                    $('#btnAddPayment').data({'acct_id':cust_ID, 'acct_name': cust_name,'bal':bal});
                }// end success
              });


        $('#modal_acct-window').modal('show');
        $('#account_id').empty().append(cust_ID);
        //$('#btnAddPayment').data({'acct_id':cust_ID, 'acct_name': cust_name,'bal':bal});
        //console.log('data[0].acct_closed::', $('body').data().acct_x );
        //if($('body').data().acct_x){$('#acctClosed').empty().append('Account Closed')}
    });
//////////// submit form to edit customer account /////////////
/////////////////////////////////////////////////////////

$( "#edit_form" ).submit(function( event ) {
      //console.log($('#target1 input:eq(0)').val());
      //console.log($('#target1 input:eq(1)').val());
      //console.log($('#target1 input:eq(2)').val());
      //console.log($('#target1 input:eq(3)').val());
      //console.log($('#target1 input:eq(4)').val());
      //console.log($('#target1 input:eq(5)').val());
      //console.log($('#target1 input:eq(6)').val());
      
      event.preventDefault();
            $.ajax({
                      type: 'post',
                      url: '/accounts/edit',
                      dataType:'text',
                      //processData: false,
                      data: {myparam1: $('#edit_form input:eq(0)').val(),
                            myparam2: $('#edit_form input:eq(1)').val(),
                            myparam3: $('#edit_form input:eq(2)').val(),
                            myparam4: $('#edit_form input:eq(3)').val(),
                            myparam5: $('#edit_form input:eq(4)').val(),
                            myparam6: $('#edit_form input:eq(5)').val(),
                            myparam7: $('#edit_form input:eq(6)').val(),
                            QuarterCost: $('#edit_form input:eq(7)').val(),
                            
                            //authenticity_token: window._token
                            },
                      success: function(data){
                          console.log('inside success');
                   alert( "Handler for .submit() called. record updated" );
                   // $('#modal_acct-window').modal('close');

                      }  // end of success
                    }) /// end of ajax call
    })

//////////////////////////////////////////////////////
////////////// close customer account //////////////
/////////////////////////////////////////////////////
    $('#btnDeleteAcct').click(function(){
              console.log('close account button');
              console.log('account_id', $('#account_id').text());
              var a_id = parseInt($('#account_id').text());
              console.log(a_id);
              var conf=confirm('are you sure you want to close this acct?');
                  if(conf==true){
                            $.ajax({
                              type: 'post',
                              url:  '/accounts/close_acct',
                              dataType: 'text',
                              data:  {acct_id: a_id},
                              success: function(data){
                                        console.log('inside success');
                                        alert('Account Closed');
                                      } // end success
                             })  // end ajax call
                  }
    });
////////////////////////////////////////////////////

////////////////////////////////////////////////////
////////////////// add payment cash/cheque /////////
////////////////////////////////////////////////////
    $('#btnAddPayment').click(function(){
              console.log('Add Payment button');
             // var acct_id=$('#account_id').val();
              console.log($('#btnAddPayment').data().acct_id);
              $('#modal_add_payment').modal('show');
              $('form.new_payment #acctName').val($('#btnAddPayment').data().acct_name);
              $('form.new_payment #acctID').val($('#btnAddPayment').data().acct_id);
              $('form.new_payment #payment_date').datepicker({dateFormat :'yy-mm-dd'}).val("");
              $('form.new_payment #amt').val("");
              });
    $('form.new_payment').submit(function(e){
      e.preventDefault();
        $.ajax({
                type: 'post',
                url:  '/payments/new',
                dataType: 'text',
                data:  {acct_id: $('form.new_payment #acctID').val(),
                        tr_date: $('form.new_payment #payment_date').val(),
                        amt:     $('form.new_payment #amt').val(),
                        payment_type: $('form.new_payment #payment_type').val()
                        },
                success: function(data){
                          console.log('inside success');
                          alert('inside success');
                        } // end success
        })  // end ajax call
    });  // end submit
////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/////////////// page redirect ////////////////////////
////////////////////////////////////////////////////
$('#btnRedirect').click(function(){
              console.log('redirect');
              console.log($('#btnAddPayment').data().acct_id);
              pageRedirect($('#btnAddPayment').data().acct_id);
            });
////////////////////////////////////////////////////
$('#btnShowPdf').click(function(){
             // console.log('redirect pdf');
             // var addr=$('#tags-v1').data().prop;
              //var name=$('#btnAddPayment').data().acct_name;
              var acct_id=$('#btnAddPayment').data().acct_id;
              acct_id=parseInt(acct_id);
              //var balance=$('#btnAddPayment').data().bal;
           
              window.location.href = '/static_pages/show_pdf.pdf?acct_id='+acct_id;
              
            });

//////////////////////////////////////////////////////
//////////////// tab modal //////////////////////////

$("#tabs").tabs({
    activate: function (event, ui) {
        var active = $('#tabs').tabs('option', 'active');
        var acct=$('#btnAddPayment').data().acct_id
        var idx=$('#tags-v1').data().i_value;
        console.log('acct_id',acct);
       // $('#tabs-2-flat').empty().append($('#tags-v1').data().flat);
console.log('customers data quarter_cost',$('#tags-v1').data().cust_details[idx].quarter_cost);
//console.log('quarter_cost',$('#tags-v1').data().quarter_cost);
        $('#tabs-2-quarterly_cost').empty().append($('#tags-v1').data().quarterly_cost);
        $('#tabs-2-quarter_cost').empty().append($('#tags-v1').data().cust_details[idx].quarter_cost);
        $('div.modal-body #balance').empty().append($('#btnAddPayment').data().bal);
        $('div.modal-body #address').empty().append($('#tags-v1').data().prop);
        $("#tabid").html('the tab id is ' + $("#tabs ul>li a").eq(active).attr("href"));

    }
}

);
/////////////////////////////////////////////////////
////////////////// add billing /////////
////////////////////////////////////////////////////
$('#btnAddBilling').click(function(){
              console.log('Add Billing button');
             // var acct_id=$('#account_id').val();
              console.log($('#btnAddPayment').data().acct_id);
                $('#modal_add_billing').modal('show');
                $('form.new_billing #acctName').val($('#btnAddPayment').data().acct_name);
                $('form.new_billing #acctID').val($('#btnAddPayment').data().acct_id);
                $('form.new_billing #billing_date').datepicker({dateFormat :'yy-mm-dd'}).val("");
                $('form.new_billing #amt').val("");
                $('form.new_billing #billingFor').val("");
                 });
            $('form.new_billing').submit(function(e){
                  e.preventDefault();
                    $.ajax({
                            type: 'post',
                            url:  '/payments/billing',
                            dataType: 'text',
                            data:  {acct_id: $('form.new_billing #acctID').val(),
                                    billing_date: $('form.new_billing #billing_date').val(),
                                    amt:     $('form.new_billing #amt').val(),
                                    billing_for: $('form.new_billing #billingFor').val()
                                    },
                            success: function(data){
                                      console.log('inside success');
                                      alert('inside success');
                                    } // end success
                    })  // end ajax call
                });  // end submit

  }); // end of document ready


/////// helper functions
        var insideAngleBrackets = function(str) {
              if (str!=null && str.indexOf('<')!=-1){
                var len=str.length;
                var pos1=str.indexOf('<');
                var pos2=str.indexOf('>');
                str=str.slice(pos1+1,pos2);
                }
                return str;
            }

        var dateToInt = function(date){
          if(date!=null)
            {date=date.replace('-','').replace('-','');
            date=parseInt(date);
          }
          return date;
        }

        function pageRedirect(a) {
          window.location.href = "/accounts/"+a+"";
        }


var css_attr={ "color": "blue",
                                             "font-weight": 900,// "bold",
                                             "font-size": "large",
                                             "font-family":"verdana"};

 