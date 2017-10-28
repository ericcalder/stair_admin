json.array! @acctdata do |a|
	json.id				a.id
	json.bal			a.bal
	json.bal_date		a.bal_date
	json.customer_id	a.customer_id
	json.start_date		a.start_date
	json.close_date		a.close_date
	json.acct_closed	a.acct_closed
	json.payments   a.payments do |payment|
	json.tdate		payment.tdate
	json.amt		payment.amt
	json.trans		payment.trans
	json.transType	payment.type_of_trans
	end	
end
