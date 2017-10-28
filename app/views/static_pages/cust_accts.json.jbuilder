json.cust_a @prop_acct do |c|
	#json.prop 			account.customer.property.prop
	json.name			c.name
	json.email			c.email
	json.property_id	c.property_id
	#json.quarterly_cost	account.customer.property.quarterly_cost
	#json.acct_id		account.id
	#json.bal			account.bal
	json.acct_closed	c.account.acct_closed
	json.customer_id	c.id

	json.payments   c.account.payments do |payment|
	json.tdate		payment.tdate
	json.amt		payment.amt
	json.trans		payment.trans
	end	
end
