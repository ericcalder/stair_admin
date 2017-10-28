class ReportPdf < Prawn::Document
  def initialize(account, customer, property)
    super()
    @account = account
    @customer = customer
    @property = property
    @balance_due = @account.bal_due
   

    header
    account_details
    table_content
    text_content
  end

  def header
    #This inserts an image in the pdf file and sets the size of the image
    #image "#{Rails.root}/app/assets/images/logo.png", width: 530, height: 150
    image "#{Rails.root}/app/assets/images/logo2.jpg", width: 530, height: 150
  end

  def account_details
    bounding_box([30, 600], :width => 270, :height => 150) do
      stroke_color 'FFFFFF'
        stroke_bounds
        stroke do
            stroke_color '333333'
            fill_color 'eeeeee'
            fill_and_stroke_rounded_rectangle [cursor - 200,cursor], 250, 80, 10
            fill_color '000000'
     move_down 10
     indent(5) do  
    text "#{@customer.name}"
    text "#{@property.flat}  #{@property.address}"
    text "#{@property.postcode}"
    text "Customer Account #{@account.id}"
    text "Invoice Date :   #{Date.today}"

    end
  end
  end
    move_up 30
   text "Opening Balance Due #{@account.bal_date}  £#{@account.bal}"
  end

  def text_content
    # The cursor for inserting content starts on the top left of the page. Here we move it down a little to create more space between the text and the image inserted above
    y_position = cursor - 50

    # The bounding_box takes the x and y coordinates for positioning its content and some options to style it
    bounding_box([0, y_position], :width => 270, :height => 300) do
      text "Balance now due = £#{@balance_due}", size: 14, style: :bold
      text "Payment details   Bank Account: Capital Stair Cleaning, Sort Code 82-63-00 Account No. 90178513"
    end

    bounding_box([300, y_position], :width => 270, :height => 300) do
      text "Duis vel", size: 10, style: :bold
      text "Duis vel tortor elementum, ultrices tortor vel, accumsan dui. Nullam in dolor rutrum, gravida turpis eu, vestibulum lectus. Pellentesque aliquet dignissim justo ut fringilla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut venenatis massa non eros venenatis aliquet. Suspendisse potenti. Mauris sed tincidunt mauris, et vulputate risus. Aliquam eget nibh at erat dignissim aliquam non et risus. Fusce mattis neque id diam pulvinar, fermentum luctus enim porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    end

  end

  def table_content
    # This makes a call to product_rows and gets back an array of data that will populate the columns and rows of a table
    # I then included some styling to include a header and make its text bold. I made the row background colors alternate between grey and white
    # Then I set the table column widths
   table account_rows do
      row(0).font_style = :bold
      self.header = true
      self.cell_style = {:size => 11, :border_color => "ffffff"}

      self.row_colors = ['DDDDDD', 'FFFFFF']
      self.column_widths = [80, 340, 60, 60]
  end
  end

  def account_rows
    pay=[]
    qry1='tdate > ?', @account.bal_date
    
    @account.payments.where(qry1).order(:tdate).each do |row|
      pay<<row

    end
    
    
    [['Date', 'Transaction', 'Credit', 'Debit']] +
     #pay<<@account.payments.first
      pay.map do |p|
        if (p.type_of_trans==0 || p.type_of_trans==nil)  
          [p.tdate, p.trans, "£#{p.amt}", ""]
        else
          [p.tdate, p.trans, "" ,"£#{p.amt}"]
        end
      end


  end
########



end