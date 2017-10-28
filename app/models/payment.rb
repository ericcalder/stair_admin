class Payment < ActiveRecord::Base
	belongs_to :account

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Payment.create! row.to_hash
	end
	end	

	def self.search(search)
  		where("trans LIKE ?", "%#{search}%") 
	end
end
