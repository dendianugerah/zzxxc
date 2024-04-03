package main

import (
	"fmt"
)

func main() {
	var n int
	fmt.Scan(&n)

	grades := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Scan(&grades[i])
	}

	roundedGrades := gradingStudents(grades)
	fmt.Println("Result: ")
	for _, grade := range roundedGrades {
		fmt.Println(grade)

	}
}

func gradingStudents(grades []int) []int {
	roundedGrades := make([]int, len(grades))
	for i, grade := range grades {
		if grade < 38 || grade%5 < 3 {
			roundedGrades[i] = grade
		} else {
			roundedGrades[i] = grade + (5 - grade%5)
		}
	}
	return roundedGrades
}
