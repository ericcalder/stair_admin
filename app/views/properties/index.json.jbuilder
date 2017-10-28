json.array!(@properties) do |p|
  json.prop        	 	p.prop
  json.flat   	  	 	p.flat
  json.address       	p.address
  json.id			 	p.id
  json.postcode	     	p.postcode
  json.quarterly_cost	p.quarterly_cost
end