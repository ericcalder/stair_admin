json.array! @properties do |p|
  json.label        	 	 p.prop
  json.id			 		       p.id
  json.address				   p.address
  json.flat					     p.flat
  json.postcode				   p.postcode
  json.quarterly_cost		 p.quarterly_cost
  
  json.customers	     	 p.customers do |customer|
  	json.customer_id	    customer.id
  	json.name			        customer.name
    json.quarter_cost     customer.quarter_cost
  end
  
end