module PropertiesHelper
	def find_id(id)
		p=Property.find(id)
		return p
	end
end
