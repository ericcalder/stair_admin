json.account @acct_search do |account|
	json.prop 			account.customer.property.prop
	json.name			account.customer.name
	json.email			account.customer.email
	json.property_id	account.customer.property_id
	json.quarterly_cost	account.customer.property.quarterly_cost
	#json.acct_id		account.id
	json.bal			account.bal
	json.customer_id	account.customer_id

	json.payments   account.payments do |payment|
	json.tdate		payment.tdate
	json.amt		payment.amt
	json.trans		payment.trans
	end	
end




