package main

import (
	"database/sql"
	"dendianugerah/sprintasia/handler"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

var db *sql.DB

func Database() {
	var err error

	// err = godotenv.Load(".env")
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }

	connectionString := os.Getenv("DATABASE_URL")
	db, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	fmt.Println("Database connected")
}

func main() {
	Database()
	router := mux.NewRouter()

	router.HandleFunc("/api/tasks", handler.GetTasks).Methods("GET")
	router.HandleFunc("/api/task/{id}", handler.GetTask).Methods("GET")
	router.HandleFunc("/api/task", handler.CreateTask).Methods("POST")
	router.HandleFunc("/api/task/{id}", handler.UpdateTask).Methods("PUT")
	router.HandleFunc("/api/task/{id}", handler.DeleteTask).Methods("DELETE")
	router.HandleFunc("/api/task/{id}/complete", handler.MarkTaskAsCompleted).Methods("PUT")

	handler.InitDB(db)

	fmt.Println("Server started at port 8080")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.ListenAndServe(":"+port, c.Handler(router))
}
