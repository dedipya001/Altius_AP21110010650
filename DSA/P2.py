# detecting cycle in LL ft. FLowds Cycle algo

# innitializing node for a LL

class Node:
    def __init__(self,data1,next1=None):
        self.data = data1
        self.next =next1

def has_Cycle(head):      #this is called slowfast approach,  it is a modification of slow fast approach to find ,idpoint, we extend  and see that when  slow= fast there is a cyclepresent
    if not head or not head.next:
        return False
    
    slow = head
    fast = head.next
    while slow!=fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    return True

node1 = Node(1)
node2 =Node (2)
node3=Node(3)
node4 = Node(4)

node1.next = node2
node2.next =node3
node3.next = node4
node4.next = node2

print(has_Cycle(node1))

