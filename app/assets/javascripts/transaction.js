
$(document).ready(function(){
  console.log('doc ready');


   ////////////////////////////////////////////////////////////////////////
   $('tbody.import-data tr').click(function(){
    console.log('import-test');
    $('tbody.import-data').val($(this).index());  //save row index for later use
    console.log($(this).index());
    var transDate=($(this).find('td:nth-of-type(1)').text());
    var transAmt=($(this).find('td:nth-of-type(2)').text());
    var trans=($(this).find('td:nth-of-type(3)').text());
    console.log(trans);
    var  regx=/\d{6}\s\d{8}|\d{14}$/;       ////\d{14}$/;
    //var regx_tb=/\d{6}\s\d{8}$/;
    var  regx_invoice= /\d{8}/;

    var custID_inv=trans.substring(trans.search(regx_invoice),trans.search(regx_invoice)+4);
    var sortacct=trans.substring(trans.search(regx),trans.search(regx)+14);
    //var search_param=sortacct;
    console.log(sortacct);
    console.log('customer_id:',custID_inv);
    console.log('regx',trans.search(regx));
    //console.log('regx_tb:', trans.search(regx_tb));
    console.log('regx_invoice:', trans.search(regx_invoice));
    // logic ///////////////////////////////////////////
      if(trans.search(regx)>0){   //// sortacct found
        var search_param=sortacct;
        var stype=0; 
        console.log('inside if search_param:',search_param,'  stype:',stype);
      }
      else if(trans.search(regx<0)&trans.search(regx_invoice)>0){ /// no sortacct but inv# found
        var search_param=custID_inv;
        var stype=1;
        console.log('inside else if search_param:', search_param);
      }
      else if(trans.search(regx<0)&trans.search(regx_invoice)<0){  //// no sortacct or inv#
        var search_param=0;    //// data search+param = 0 will return data.length ==0
        var stype=2;
        console.log('inside else if search_param:', search_param,'stype',stype);
      }
               $.ajax({
                    url: '/transactions/customer_data',
                    type: 'get',
                    dataType: 'json',
                    //cache: false,
                    data : { data_value: search_param,
                              data_type: stype},
                    success: function(data){
                      if (data.length>0){
                          console.log('inside ajax customer_data', data.length);
                          var css_attr={ "color": "blue",
                               "font-weight":"bold",
                               "font-family":"verdana"};
                          $('#trans, #transDate, #transAmt, #trans_matches, #payment_already_exists').empty();
                          $('#modal1-window').modal('show'); 
                          
                          $('#transDate').append(transDate).css(css_attr);
                          $('#transAmt').append(transAmt).css(css_attr);
                          $('#trans').append(trans).css(css_attr);
                          $('#trans_matches').val("");/// null value at #trans_matches
                            $.each(data,function(index, element){

                              $('#trans_matches').append('<tr><td> '+element.customer_id+
                              ' </td> <td> '+element.name+
                              ' </td> <td> '+element.prop+
                              ' </td> <td> '+element.tdate+
                              ' </td> <td> '+element.amt+
                              ' </td></tr>');
                                  console.log(pDate(transDate)+" "+element.tdate+"     "+parseFloat(transAmt)+" "+element.amt);
                                    if (element.amt==parseFloat(transAmt)&& element.tdate==pDate(transDate)) {
                                      console.log('payment already exists at:',index);
                                      console.log(transDate);
                                      //$('#trans').append('duplicate');//css({"color":"blue"});
                                       $('#trans_matches').val(index);
                                    
                                    }  // end if
                                    // $('#trans_matches').val(index);
                              //      console.log('index:',$('#trans_matches').val());
                                
                            });/// end of each  
     ////////////////////////////////////////////////////////////////////
                              var i=$('#trans_matches').val();
                              
                              //console.log('index value:',$('#trans_matches').val());
                              //console.log('i:=',$.type(i));
                              //var ii=parseInt(i);
                              //console.log('ii:=',ii, 'type:=',$.type(ii));
                              if (i>=0){    // if value at #trans_matches not null
                                $('#payment_already_exists').append('payment already exists').css('color','red');
                                $('#trans_matches>tr:eq('+ i  +')' ).css(css_attr);
                              }
                      } // end of 'if' for data.length>0 
      ///// ie response data=[] nothing found form sortacct or custID
                      else {
                            //if(trans.search(regx_invoice)>0){
                              console.log('no find sortacct but find custID:',custID_inv);
                            //}
                            //alert('sort/acct found in csv but not found in database');
                            console.log('inside else modal_new', data.length);
                              var css_attr={ "color": "blue",
                                             "font-weight": 900,// "bold",
                                             "font-size": "large",
                                             "font-family":"verdana"};
                                $('#modal_new-window').modal('show');
                                $('#btnSave2').hide();
                                $('#btnAddNewCust').hide();
                                $('#transNew, #transDateNew, #transAmtNew, #modal_new').empty();
                                $('#transDateNew').append(transDate).css(css_attr);
                                $('#transAmtNew').append(transAmt).css(css_attr);
                                $('#transNew').append(trans).css(css_attr);
                                ///////aaaaaaaaaaaaaaaaaaa//////////////////
                                /////////////
                                $('#modal_new').val('');/// zero input
                                $('#pymt-to').empty();
                                $('#cust-accts').empty();
                                   $("#modal_new").autocomplete({
                                    ////////////// ssssssssssssssssssssssss
                                      source: function(request,response){
                                            $.ajax({
                                              url: "/static_pages/home",
                                              dataType: "json",
                                              data: {term: request.term},

                                              success: function(data){
                                                console.log("tags1 data"+data);

                                                response(data);
                                              } //// end success
                                            });
                                             /// end ajax
                                      },  /// end source
                                      minLength: 3,
                                      autoFocus: true,
                                      select: function( event, ui ) {
                                      console.log('select',ui.item.value);
                                      $('body').data('foo',{keyv:ui.item.value,
                                                            keyy:ui.item.id});
                                      console.log('select customers',ui.item.customers[0].customer_id);
                                      $('#pymt-to').empty().append("Accounts for:  ",ui.item.value);
                                      //$('#cust-accts').empty();
                                        $.each(ui.item.customers, function(index, element){
                                          $('#cust-accts').append(
                                            '<tr><td> '+element.customer_id+
                                            '</td><td>'+element.name+'</td></tr>'
                                            );
                                        })/// end of each
                                        $('#btnAddNewCust').show();

                                        $('#cust-accts tr').click(function(){
                                          console.log('acct clicked');
                                          $('#btnSave2').show();
                                          $('#btnAddNewCust').hide();
                                          $(this).css(css_attr);
                                          var acctID=($(this).find('td:nth-of-type(1)').text());
                                          var acctname=($(this).find('td:nth-of-type(2)').text());
                                          console.log(acctID, acctname);
                                          $('#to-acct').empty().append('Save to Account:',acctID);
                                          $('#cust-accts').data({id:acctID, name:acctname});// save value
                                        })
                                        
                                      } //// end of select
                                   }); //// end autocomplete       
                                   //////aaaaaaaaaaaaaaaaaaaaaaa//////////////////////
                            }; /// end else       
    //////////////////////////////////////////////////////////////////////////////
                    }  //// end of success
                }); // end of ajax call
      // else{alert('no sort/account on trans');}
   });
   ///////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////
    $('#btnSave1').click(function(){
              console.log('save button clicked');
              var cust_id=$('#trans_matches >tr:last>td:first').text();
              var transDate=$('#transDate').text();
              var transAmt=$('#transAmt').text();
              var trans=$('#trans').text();
              
                    $.ajax({
                      type: 'POST',
                      url: '/payments/test',
                      dataType:'text',
                      //processData: false,
                      data: {myparam1: cust_id,
                            myparam2: transDate,
                            myparam3: transAmt,
                            myparam4: trans,
                            //myparam5: cust_id,
                            //authenticity_token: window._token
                            },
                      success: function(data){

                              alert(transDate+" £"+transAmt+" "+trans+'\n'+"Payment Saved. "); //displays variable inside alert
                              $('#modal1-window').modal('hide'); // closes modal window
                              $('tbody.import-data tr').eq($('tbody.import-data').val()).hide();    //  hides selected element
                      }  // end of success
                    }) /// end of ajax call
    }); // end of #btnSave1 

     $('#btnSave2').click(function(){
              console.log('save button2 clicked');
              var cust_id=$('#cust-accts').data().id;
              var cust_name=$('#cust-accts').data().name;
              //var cust_id=$('#cust-accts >tr>td:first').text();
              console.log('custID',cust_id,'   custName', cust_name);
              var transDate=$('#transDateNew').text();
              var transAmt=$('#transAmtNew').text();
              var trans=$('#transNew').text();
              $.ajax({
                      type: 'POST',
                      url: '/payments/test',
                      dataType:'text',
                      //processData: false,
                      data: {myparam1: cust_id,
                            myparam2: transDate,
                            myparam3: transAmt,
                            myparam4: trans,
                            //myparam5: cust_id,
                            //authenticity_token: window._token
                            },
                      success: function(data){

                              alert(transDate+" £"+transAmt+" "+trans+'\n'+"Payment Saved. "); //displays variable inside alert
                              $('#modal_new-window').modal('hide'); // closes modal window
                              $('tbody.import-data tr').eq($('tbody.import-data').val()).hide();    //  hides selected element
                      }  // end of success
                    }) /// end of ajax call
              }) ///end btnSave2   
    

    //////////////   new customer account  form /////

    $('#btnAddNewCust').click(function(){
      console.log('#btnAddNewCust   clicked');
      $('#modal_new_customer_acct_form_t').modal('show');
      //$('#myModal2').modal('show');
      var i=$('body').data('foo').keyv;
      var propID=$('body').data('foo').keyy;
      $('#propadd').empty().append('for:',i, 'propID: ',propID);
      $('#propID_t').val(propID);
      $('#new_start_date_t').datepicker({dateFormat :'yy-mm-dd'});
      $('#new_bal_date_t').datepicker({dateFormat :'yy-mm-dd'});
    })
/////// submit form for new customer /////////////////////
    $( "#new_cust_acct_t" ).submit(function( event ) {
      console.log($('#new_cust_acct_t input:eq(0)').val());
      console.log($('#new_cust_acct_t input:eq(1)').val());
      alert( "Handler for .submit() called." );
      event.preventDefault();
       $('#error-message').empty();
          if( !isEmail($('#new_cust_acct_t input:eq(1)').val())) { 
            console.log('invalide email'); 
            $('#error-message').empty().append('invalide email');
          }
      $.ajax({
                      type: 'post',
                      url: '/customers/new',
                      dataType:'text',
                      //processData: false,
                      data: {myparam1: $('#new_cust_acct_t input:eq(0)').val(),
                            myparam2: $('#new_cust_acct_t input:eq(1)').val(),
                            myparam3: $('#new_cust_acct_t input:eq(2)').val(),
                            myparam4: $('#new_cust_acct_t input:eq(3)').val(),
                            myparam5: $('#new_cust_acct_t input:eq(4)').val(),
                            myparam6: $('#new_cust_acct_t input:eq(5)').val(),
                            
                            //authenticity_token: window._token
                            },
                      success: function(data){
                          console.log('inside success');
                            
                      }  // end of success
                    }) /// end of ajax call
    });



   


}); // end of document ready


/////////////////// helper functions ///////////////////////////////////


var pDate= function(from){
              var ar=from.split('/');
              var arr=['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep','Oct','Nov','Dec'];
              var i= $.inArray(ar[1],arr);
                  if(i<9){
                  var res = ar[2]+"-"+"0"+(i+1)+"-"+ar[0];
                  }
                  else {var res = ar[2]+"-"+(i+1)+"-"+ar[0];}
              return res;
            }


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}