class StaticPagesController < ApplicationController
  def home
  	respond_to do |format|
  	format.html
    format.json { @properties = Property.search(params[:term]) }
  	#format.csv {send_data @properties.as_csv}
    end
  end

  def search
    @cust_id=params['data_value']
    #@cust_id=Customer.where(property_id: params[:data_value]).first.cid

    respond_to do |format|
     # @cust_search = Customer.where(property_id: params[:data_value])
      format.html #{ @properties = Property.search_id(params[:data_value]) }
      #format.json { @cust_search = Customer.where(property_id: params[:data_value])}
      format.json { @acct_search = Account.where(customer_id: @cust_id)}
      #format.json { @payment_search = Payment.where(account_id: @cust_id)}
    end
    
  end

  def cust_accts
    @v=params['data_value']
    #@prop_accts=Customer.where(property_id: params[:data_value])

    respond_to do |format|
     # @cust_search = Customer.where(property_id: params[:data_value])
      format.html #{ @properties = Property.search_id(params[:data_value]) }
      #format.json { @cust_search = Customer.where(property_id: params[:data_value])}
      format.json { @prop_acct = Customer.where(property_id: params[:data_value])}
      #format.json { @payment_search = Payment.where(account_id: @cust_id)}
    end
    
  end
 
  def show_pdf
 #   @a = params['acct_id']
    @account=Account.find(params['acct_id'])
    @customer=Customer.find_by_id(@account.customer_id)
    @property=Property.find_by_id(@customer.property_id)

    #@account_id=params['ac_id']
    #@addr=params['address']
    #@name=params['nam']
    #@balance-params['bal']

    respond_to do |format|
      format.html
      format.pdf do
        pdf = ReportPdf.new(@account, @customer, @property)
        send_data pdf.render, :disposition => 'inline', type: 'application/pdf'
          
        end
    end  
  end



  def help
  end
end
