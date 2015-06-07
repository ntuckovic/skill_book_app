# skill_book_app
DJango based application for generate of graph images using skill_book js graphs 

## Instructions:

### Setup
    1. run **pip install -r requirements.txt** in your shell
    2. run **python manage.py migrate** to setup database
    3. run **python manage.py runserver** to start dev server

### Using app:
 1. Line graph:
    For example if you are intrested in Line graph under id **136** you can get it under following link on your dev      server:
      http://127.0.0.1:8000/graphs/lines/136/

    You can save graph as PNG file if you click on green button.
    
    If you want to get graph PNG via link you can do it in two ways, by appending **outcome** GET parameter:
      
      Render Graph and start downloading of PNG file: http://127.0.0.1:8000/graphs/lines/120/?outcome=download
      
      Render Graph and redirect directly to newly generated PNG file:  http://127.0.0.1:8000/graphs/lines/120/?outcome=link
