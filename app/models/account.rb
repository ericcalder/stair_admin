class Account < ActiveRecord::Base
	#self.primary_key ="customer_id"
	belongs_to :customer
	has_many :payments

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Account.create! row.to_hash
	end
	end

	def bal_due
		## works out the balance due = start bal - sum of payments + sum of billings
		balDate= self.bal_date#'2015-01-01'
		qry1='tdate > ? and type_of_trans= ?', balDate, 0
		qry2='tdate > ? and type_of_trans= ?', balDate, 1
		if (self.bal.present?)# != "")
		self.bal-self.payments.where(qry1).sum(:amt)+ self.payments.where(qry2).sum(:amt)
		else
			self.payments.where(qry2).sum(:amt)-self.payments.where(qry1).sum(:amt)
		end
	end
end
