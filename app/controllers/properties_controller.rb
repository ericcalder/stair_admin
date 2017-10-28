class PropertiesController < ApplicationController

  #before_filter :search
  def index
  	#@properties = Property.all
    
    #@property=Property.find(@v)
  	respond_to do |format|
  	format.html
    format.json { @properties = Property.search(params[:term]) }
  	format.csv {send_data @properties.as_csv}
    end
   # @v=params['data_value']
     
  end

   def search
    @cust_id=params['data_value']
    #@cust_id=Customer.where(property_id: params[:data_value]).last.cid

    respond_to do |format|
     # @cust_search = Customer.where(property_id: params[:data_value])
      format.html #{ @properties = Property.search_id(params[:data_value]) }
      #format.json { @cust_search = Customer.where(property_id: params[:data_value])}
      format.json { @acct_search = Account.where(customer_id: @cust_id)}
      #format.json { @payment_search = Payment.where(account_id: @cust_id)}
    end
    
  end

  def import
  	Property.import(params[:file])
  	redirect_to root_url
  end

  def show
    qry='address=  ?', '1 Balcarres St'
    @v=params['data_value']
    #@account=Account.find(params[:id])
    #@customer=Customer.find(@account.customer_id)
    #@properties = Property.where('address=  ?', '1 Balcarres St')
     @properties = Property.find(@v)
    #redirect_to '/properties/show'
    # return

    respond_to do |format|
      format.html
      format.pdf do
        pdf = SheetPdf.new(@properties)
        send_data pdf.render, filename: 'sheet.pdf', type: 'application/pdf'
      end
    end
  end
  

  	
end
