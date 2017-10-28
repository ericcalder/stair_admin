class Transaction < ActiveRecord::Base
	
	def self.to_csv
		CSV.generate do |csv|
			csv << column_names
			all.each do |i|
				csv << i.attributes.values_at(*column_names)
			end
		end
	end


end
