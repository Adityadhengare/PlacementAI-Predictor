from aao import app
from waitress import serve

if __name__ == '__main__':
    print("🚀 Starting Enterprise Production Server on http://127.0.0.1:5000")
    print("✅ Waitress WSGI Server is Active.")
    print("✅ Ready to handle 200+ concurrent users with multi-threading!")
    
    # threads=8 lagane se ye multiple requests ek sath handle karega
    serve(app, host='127.0.0.1', port=5000, threads=8)