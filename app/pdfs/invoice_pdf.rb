class InvoicePdf < Prawn::Document 
  #// `include` instead of subclassing Prawn::Document
  #// as advised by the official manual
  #include Prawn::View

  def initialize
   # super()
   # @account_id=data
    content
  end

  def content
    
    #text "Hello World!"
    #text "#{@account_id}"
    #text "Invoice Date :   #{Date.today}"
    #// here comes more code for generating PDF content
    #// ...
  end
end  