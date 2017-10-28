module TransactionHelper
## adds header +deletes balance and currency columns and deletes debits
	def pars(ary)
	ar=[]
	#ary.insert(0,hdr)
	ary.each {|t| t.delete_at(2) }
	ary.each {|t| t.delete_at(2) }
	
	ary.each do |t|
		if((/-\d*\.\d\d/=~ t[1]) == nil)
		ar<<t	
		end
	end
	return ar
	end
	####################

##### looks in 3rd elemnt of array for the invoice number and returns inv (if present)
	def inv(ar)
	regx=/\d{8}\s/ # regex for invoice number (without space \s)
		if((regx=~ ar[2]) != nil) #looks in 3rd elemnet of array
			inv=ar[2][regx]
		else
			inv=""
		end
		return inv
	end
###############################################
### looks in 3rd element for the sort/acct (14 digits) and returns it
	def acct(ar)
	regx=/\d{14}$/
		if((regx=~ ar[2]) != nil) #looks in 3rd elemnet of array
			acct=ar[2][regx]
		else
			acct=""
		end
		return acct
	end
	#######################################################
	### appends sort/acct to array (if sort/acct exists)
	def appnd_sort_acct(arr)
		ln= arr.length
		(0..(ln-1)).each do |t|
			if acct(arr[t]).present?
				arr[t]<<acct(arr[t]) #if sort/acct.present?
			else                          # appends acct id to arr
				arr[t]<<""
			end
		end
		return arr
	end
	### appends the invoice # to each array (if invoice # exists)
	def appnd_inv(arr)
		ln= arr.length
		(0..(ln-1)).each do |t|
			if inv(arr[t]).present?
				arr[t]<<inv(arr[t])[0..3] #if inv(arr[t]).present?
			else                          # appends acct id to arr
				arr[t]<<""
			end
		end
		return arr
	end
	### appends the address to each transaction array if the account id exists
	def appnd_db_addr_name(arr)
		ln=arr.length
		(0..(ln-1)).each do |t|
			if arr[t][3] != "" && Account.exists?(arr[t][3]) ## if has inv# and id exits in dtabase
				cust_id=Account.find(arr[t][3]).customer_id
				cust_name=Customer.find(cust_id).name
				prop_id=Customer.find(cust_id).property_id
				address=Property.find(prop_id).prop
				arr[t]<< address#'works'
				arr[t]<<cust_name
			else 
				arr[t]<<""
				arr[t]<<""
			end
		end
		return arr

	end
################################################
## append payments.tbl search for sort/acct
	def appnd_db_sort_acct(arr)
		ln=arr.length
		(0..(ln-1)).each do |t|
			if arr[t][6] != "" && Payment.exists?(["trans like ?", "%#{arr[t][6]}%"]) ## if has inv# and id exits in dtabase
				cust_id=Payment.where("trans like ?", "%#{arr[t][6]}%").last.account_id
				cust_name=Customer.find(cust_id).name
				prop_id=Customer.find(cust_id).property_id
				address=Property.find(prop_id).prop
				arr[t]<< address
				arr[t]<<cust_name
				arr[t]<<cust_id
			else 
				arr[t]<<""
				arr[t]<<""
				arr[t]<<""
			end
		end
		return arr		
	end



end
