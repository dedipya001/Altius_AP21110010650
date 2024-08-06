# reverse a LL

# innitializing node for a LL

class Node:
    def __init__(self,data1,next1=None):
        self.data = data1
        self.next =next1

# converting arr to LL

def ArrtoLL(arr):
    head = Node(arr[0])
    current = head
    for i in arr[1:]:
        current.next = Node(i)
        current = current.next
    return head
        
#  function for printing the LL

def printLL(head):
    current = head
    while(current):
        print(current.data , end="->")
        current=current.next
    print("NULL")
    
# function to reverse the LL 
def reverseLL(head):
    temp=head    #temp pointer to head
    prev = None   # prev is setto  NOne before head 
    while(temp):
        front = temp.next  #breaking links and reversing them
        temp.next =prev
        prev= temp
        temp = front
    return prev  #prev is the endofthe original LL


arr = [1,2,3,4,5]
z = ArrtoLL(arr)
printLL(z)

y = reverseLL(z)
printLL(y)