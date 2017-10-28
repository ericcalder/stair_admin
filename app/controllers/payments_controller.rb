class PaymentsController < ApplicationController

def index
  	@payments = Payment.all
  
  		respond_to do |format|
  			format.html
  			format.csv {send_data @payments.as_csv}
	end
end

def show
end

def test
  @acct_id=params[:myparam1]
  @t_date=params[:myparam2]
  @t_amt=params[:myparam3]
  @tr=params[:myparam4]
  #@acct_id_sort=params[:myparam5]
  
  
    @payment=Payment.new(tdate: @t_date, amt: @t_amt, trans: @tr, account_id: @acct_id,
   type_of_trans: 0)
  #@payment.save
    redirect_to controller: 'accounts', action: 'show', id: @payment.account_id

  
end



def new
    @acct_id=params[:acct_id]
    @t_date=params[:tr_date]
    @t_amt=params[:amt]
    @tr=params[:payment_type]

		 @payment=Payment.new(tdate: @t_date, amt: @t_amt, trans: @tr, account_id: @acct_id,
   type_of_trans: 0)
  		@payment.save
end

def billing
  @acct_id=params[:acct_id]
  @t_date=params[:billing_date]
  @t_amt=params[:amt]
  @tr=params[:billing_for]

    @payment=Payment.new(tdate: @t_date, amt: @t_amt, trans: @tr, account_id: @acct_id,
   type_of_trans: 1)   ## type_of_trans = 1 as it is a billing
    @payment.save
end

def quarter_billing
  
end

def quarter_billing_save
    @t_date= params['billing_date']
    @trans= params['billing_for']
    @bill=[]
    i = 0
    @customer=Customer.where('property_id<?', 5).each do |c|
      if (Account.find_by(customer_id: c.id).acct_closed)
        # do nothing
      else
        @bill[i] = Payment.new(tdate: @t_date, amt: c.quarter_cost, trans: @trans, 
        type_of_trans: 1, account_id: c.id)
        i = i+1
      end
    end

end




 def create

  		@payment = Payment.new(payment_params)
  		@payment.save
  		redirect_to controller: 'accounts', action: 'show', id:  @payment.account_id
 end

def import
  	Payment.import(params[:file])
  	redirect_to payments_index_url
end


private
  		def payment_params
    		params.require(:payment).permit(:amt, :trans, :tdate, :account_id, :type_of_trans)
  		end
end
