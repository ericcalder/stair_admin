json.array! @cust_data do |p|
	json.customer_id	p.account_id
	json.amt			p.amt
	json.tdate			p.tdate
	json.name			p.account.customer.name
	json.prop			p.account.customer.property.prop
end