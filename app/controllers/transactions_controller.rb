class TransactionsController < ApplicationController

  

  def index
  	
    
  end

 

  def show

    if params[:address][:id]
      @property=Property.find(params[:address][:id])
    end
  end

  def import
    @transfile=CSV.read(params[:file].path)
    
    @tfile=pars(@transfile) 

     @len=@transfile.length
    @len1=@tfile.length
  end

  def customer_data
    @sortacct= params['data_value']
    if (params['data_type'].to_i == 0)
      @cust_data=Payment.where("trans like ?", "%#{@sortacct}%")
    
    elsif (params['data_type'].to_i == 1)
      @cust_data=Payment.where('account_id = ?', params['data_value'].to_i) 
    end
      #if (!@cust_data.empty?)
          respond_to do |format|
            #format.html
            format.json{@cust_data}
          end
      #end
  end
  
  


################################################
  

  def importcsv
    #Transaction.importcsv(params[:file])
    @transfile=CSV.read(params[:file].path)
    
    @tfile=pars(@transfile)
    appnd_inv(@tfile)           ## id at col[3]
    appnd_db_addr_name(@tfile)  ## db address at col[4] name at col[5]
    appnd_sort_acct(@tfile)     ## transaction sort/acct at col[6]
    appnd_db_sort_acct(@tfile)  ## db address at col[7] name at col[8] custid at col[9]
    #@invoice_array= inv(@tfile)
    @len=@transfile.length
    @len1=@tfile.length


      
  end


end
