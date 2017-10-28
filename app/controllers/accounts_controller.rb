class AccountsController < ApplicationController
  def index
  	@accounts= Account.all
  end

  def import
  	Account.import(params[:file])
  	redirect_to accounts_index_url
  end

  def edit
  		@acct_name=params[:myparam1]
  @acct_email=params[:myparam2]
  @acct_bal=params[:myparam3]
  @acct_bal_date=params[:myparam4]
  @acct_start_date=params[:myparam5]
  @acct_close_date=params[:myparam6]
  @acct_acctID=params[:myparam7]
  @Q_cost=params[:QuarterCost]
  acct_attributes = {:bal => @acct_bal, :bal_date => @acct_bal_date, :customer_id => @acct_acctID,
                      :start_date => @acct_start_date, :close_date => @acct_close_date}
  a = Account.find_by_customer_id(@acct_acctID)
    a.update_attributes(acct_attributes)

  cust_attributes = {:name => @acct_name, :email => @acct_email, :quarter_cost => @Q_cost}

  c = Customer.find_by_id(@acct_acctID)
    c.update_attributes(cust_attributes) 

  end

  def display
    @acctID = params['acct']
    respond_to do |format|
      format.html #{ @properties = Property.search_id(params[:data_value]) }
      format.json { @acctdata = Account.where(customer_id: @acctID)}
    
    end
  end

  def show
    @account=Account.find(params[:id])
    @customer=Customer.find_by_id(@account.customer_id)
    @property=Property.find_by_id(@customer.property_id)
    
    respond_to do |format|
      format.html
      
      format.pdf do
        pdf = ReportPdf.new(@account, @customer, @property)
        send_data pdf.render, :disposition => 'inline', type: 'application/pdf'  #filename: 'report.pdf', type: 'application/pdf'
      end
    end

  end

  def update
    @acct_name=params[:myparam1]
  @acct_email=params[:myparam2]
  @acct_bal=params[:myparam3]
  @acct_bal_date=params[:myparam4]
  @acct_start_date=params[:myparam5]
  @acct_close_date=params[:myparam6]
  @acct_acctID=params[:myparam7]
 	end

  def close_acct
    @acctID=params[:acct_id]
    @account=Account.find(@acctID)
    #@account.update(acct_closed: true)

  end
private

	def account_params
		params.require(:account).permit(:start_date, :bal_date, :close_date, :customer_id, :bal)	
	end





end
