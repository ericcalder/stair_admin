class Customer < ActiveRecord::Base
	#self.primary_key ="cid"
	belongs_to :property
	has_one :account
	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Customer.create! row.to_hash
		end		
	end
end
