class Property < ActiveRecord::Base
	has_many :customers

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Property.create! row.to_hash
		end		
	end

	def self.as_csv
		CSV.generate do |csv|
			csv << column_names
			all.each do |i|
				csv << i.attributes.values_at(*column_names)
			end
		end
	end

	def self.search(term)
  		where('prop LIKE ?',  "%#{term}%")
	end
	
	def self.search_id(id)
  		#where('prop LIKE ?',  "%#{term}%")
  		find(id)
	end
end
