module AccountsHelper
	def balance_due
		## works out the balance due = start bal - sum of payments + sum of billings
		qry1='tdate > ? and type_of_trans= ?','2015-01-01', 0
		qry2='tdate > ? and type_of_trans= ?','2015-01-01', 1
		@account.bal-@account.payments.where(qry1).sum(:amt)+ @account.payments.where(qry2).sum(:amt)
	end
end
