marks=int(input("enter your marks"))
if marks>100 or marks<0:
    print("invalid marks")
else:
    if marks>=80:
        print("grade: A")
    elif marks>=60:
        print("grade: B")
    else:
        print("grade: C")