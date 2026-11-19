marks = int(input("Enter your marks: "))

if marks < 0 or marks > 100:
    print("Invalid marks")
elif marks >= 80:
    print("Grade: A")
elif marks >= 60:
    print("Grade: B")
else:
    print("Grade: C")
