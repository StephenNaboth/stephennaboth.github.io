from flask import Flask, render_template, request, send_file, jsonify
import PyPDF2
import os
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/merge', methods=['POST'])
def merge_pdfs():
    if not request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = []
    for key, file in request.files.items():
        if key.startswith('files'):
            files.append(file)
    
    if not files:
        return jsonify({'error': 'No files selected'}), 400
    
    # Validate files
    for file in files:
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        merger = PyPDF2.PdfMerger()
        
        # Save uploaded files temporarily and merge them
        temp_files = []
        for file in files:
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(temp_path)
            temp_files.append(temp_path)
            merger.append(temp_path)
        
        # Save merged PDF
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'merged.pdf')
        merger.write(output_path)
        merger.close()
        
        # Clean up temporary files
        for temp_file in temp_files:
            os.remove(temp_file)
        
        return send_file(
            output_path,
            as_attachment=True,
            download_name='merged.pdf',
            mimetype='application/pdf'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up merged file
        if os.path.exists(output_path):
            os.remove(output_path)

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True)











