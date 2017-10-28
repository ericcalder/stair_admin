class CustomersController < ApplicationController

	def index
  	@customers = Customer.all
  
  	respond_to do |format|
  	format.html
  	format.csv {send_data @customers.as_csv}
  end
  end

  def new
    @customer=Customer.new
    @customer.name=params['myparam1']
    @customer.email=params['myparam2']
    @customer.property_id=params['myparam6']
    #@customer.save
    @account=Account.new
    @account.start_date=params['myparam3']
    @account.customer_id=@customer.id
    @account.bal=params['myparam4']
    @account.bal_date=params['myparam5']
    #@account.save
  end

  def show
    @customer=Customer.find(params[:id])
    @property=Property.find(@customer.property_id)
  end

  def import
  	Customer.import(params[:file])
  	redirect_to customers_index_url
  end
end
