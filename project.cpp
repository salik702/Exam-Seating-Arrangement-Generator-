#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

struct Node
{
    int seatNumber;
    int rollNumber;
    Node *next;
    Node(int seat, int roll)
    {
        seatNumber = seat;
        rollNumber = roll;
        next = nullptr;
    }
};

class Stack
{
    Node *topNode;

public:
    Stack() { topNode = nullptr; }

    void push(int seat, int roll)
    {
        Node *n = new Node(seat, roll);
        n->next = topNode;
        topNode = n;
    }

    void pop()
    {
        if (topNode != nullptr)
        {
            Node *temp = topNode;
            topNode = topNode->next;
            delete temp;
        }
    }

    Node *top() { return topNode; }

    int isEmpty() { return topNode == nullptr; }

    void display()
    {
        Node *current = topNode;
        cout << "Seat assignment history (top to bottom):\n";
        while (current != nullptr)
        {
            cout << "Seat " << current->seatNumber + 1
                 << " -> Roll " << current->rollNumber << endl;
            current = current->next;
        }
    }
};

struct QueueNode
{
    int rollNumber;
    QueueNode *next;
    QueueNode(int roll)
    {
        rollNumber = roll;
        next = nullptr;
    }
};

class Queue
{
    QueueNode *frontNode;
    QueueNode *rearNode;

public:
    Queue()
    {
        frontNode = nullptr;
        rearNode = nullptr;
    }

    void enqueue(int value)
    {
        QueueNode *n = new QueueNode(value);
        if (rearNode == nullptr)
        {
            frontNode = rearNode = n;
        }
        else
        {
            rearNode->next = n;
            rearNode = n;
        }
    }

    int dequeue()
    {
        if (!isEmpty())
        {
            int value = frontNode->rollNumber;
            QueueNode *temp = frontNode;
            frontNode = frontNode->next;
            if (frontNode == nullptr)
            {
                rearNode = nullptr;
            }
            delete temp;
            return value;
        }
        else
        {
            cout << "Queue empty! No student to assign.\n";
            return -1;
        }
    }

    int isEmpty() { return frontNode == nullptr; }

    void display()
    {
        cout << "Students in queue:\n";
        QueueNode *current = frontNode;
        while (current != nullptr)
        {
            cout << current->rollNumber << " ";
            current = current->next;
        }
        cout << endl;
    }
};

void inputStudents(Queue &q, int n)
{
    cout << "Enter roll numbers of students:\n";
    for (int i = 0; i < n; i++)
    {
        int roll;
        cout << "Student " << i + 1 << ": ";
        cin >> roll;
        q.enqueue(roll);
    }
    cout << "Queue after input: ";
    q.display();
}

void shuffleArray(int arr[], int n)
{
    for (int i = n - 1; i > 0; i--)
    {
        int j = rand() % (i + 1);
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

void assignSeats(Queue &q, int seats[], Stack &s, int &seatCount, int totalSeats)
{
    seatCount = 0;
    int students[100];
    int studentIndex = 0;

    while (!q.isEmpty())
    {
        students[studentIndex] = q.dequeue();
        studentIndex++;
    }

    shuffleArray(students, studentIndex);

    int seatOrder[100];
    for (int i = 0; i < totalSeats; i++)
    {
        seatOrder[i] = i;
    }
    shuffleArray(seatOrder, totalSeats);

    int minGap = totalSeats / studentIndex;
    if (minGap < 2)
        minGap = 2;

    cout << "Assigning seats to students ...\n";
    for (int i = 0; i < studentIndex; i++)
    {
        int seatNum = seatOrder[i];

        int validSeat = 1;
        for (int j = 0; j < i; j++)
        {
            int assignedSeat = -1;
            for (int k = 0; k < totalSeats; k++)
            {
                if (seats[k] == students[j])
                {
                    assignedSeat = k;
                    break;
                }
            }

            if (assignedSeat != -1)
            {
                int diff = seatNum - assignedSeat;
                if (diff < 0)
                    diff = -diff;
                if (diff < minGap)
                {
                    validSeat = 0;
                    break;
                }
            }
        }

        if (validSeat == 0)
        {
            for (int k = 0; k < totalSeats; k++)
            {
                if (seats[k] == 0)
                {
                    int canUse = 1;
                    for (int j = 0; j < i; j++)
                    {
                        int assignedSeat = -1;
                        for (int m = 0; m < totalSeats; m++)
                        {
                            if (seats[m] == students[j])
                            {
                                assignedSeat = m;
                                break;
                            }
                        }

                        if (assignedSeat != -1)
                        {
                            int diff = k - assignedSeat;
                            if (diff < 0)
                                diff = -diff;
                            if (diff < minGap)
                            {
                                canUse = 0;
                                break;
                            }
                        }
                    }

                    if (canUse == 1)
                    {
                        seatNum = k;
                        break;
                    }
                }
            }
        }

        seats[seatNum] = students[i];
        s.push(seatNum, students[i]);
        cout << "Assigned Seat " << seatNum + 1 << " to Roll " << students[i] << endl;
        seatCount++;
    }
    cout << "All seats assigned.\n";
}

void undoSpecificAssignment(Stack &s, int seats[], int &seatCount, int rollToUndo, int totalSeats)
{
    if (s.isEmpty())
    {
        cout << "No assignment to undo.\n";
        return;
    }

    Stack tempStack;
    int found = 0;
    int foundSeat = -1;

    while (!s.isEmpty())
    {
        Node *current = s.top();
        if (current->rollNumber == rollToUndo && found == 0)
        {
            foundSeat = current->seatNumber;
            seats[current->seatNumber] = 0;
            s.pop();
            found = 1;
            seatCount--;
        }
        else
        {
            tempStack.push(current->seatNumber, current->rollNumber);
            s.pop();
        }
    }

    while (!tempStack.isEmpty())
    {
        Node *current = tempStack.top();
        s.push(current->seatNumber, current->rollNumber);
        tempStack.pop();
    }

    if (found)
    {
        cout << "Undo successful: Roll " << rollToUndo << " removed from Seat " << foundSeat + 1 << endl;

        int availableSeats[100];
        int availableCount = 0;

        for (int i = 0; i < totalSeats; i++)
        {
            if (seats[i] == 0 && i != foundSeat)
            {
                availableSeats[availableCount] = i;
                availableCount++;
            }
        }

        if (availableCount == 0)
        {
            availableSeats[availableCount++] = foundSeat;
        }

        if (availableCount > 0)
        {
            int newSeat = availableSeats[rand() % availableCount];
            seats[newSeat] = rollToUndo;
            s.push(newSeat, rollToUndo);
            seatCount++;
            cout << "Roll " << rollToUndo << " reassigned to Seat " << newSeat + 1 << " (shuffled)\n";
        }
    }
    else
    {
        cout << "Roll number " << rollToUndo << " not found in assignments.\n";
    }
}

void displaySeats(int seats[], int totalSeats)
{
    cout << "Final Seating Arrangement:\n";
    for (int i = 0; i < totalSeats; i++)
    {
        if (seats[i] == 0)
            cout << "Seat " << i + 1 << ": Empty\n";
        else
            cout << "Seat " << i + 1 << ": Roll " << seats[i] << endl;
    }
}

void performUndo(Stack &s, int seats[], int &seatCount, int totalSeats)
{
    char choice;
    while (cin >> choice)
    {
        if (choice == 'y' || choice == 'Y')
        {
            int rollNumber;
            if (cin >> rollNumber)
            {
                undoSpecificAssignment(s, seats, seatCount, rollNumber, totalSeats);
            }
        }
        else
        {
            break;
        }
    }
}

int main(int argc, char *argv[])
{
    int baseSeed = (argc > 1) ? atoi(argv[1]) : time(0);
    srand(baseSeed);

    int numberOfStudents;
    cin >> numberOfStudents;

    int totalSeats;
    cin >> totalSeats;

    if (numberOfStudents > totalSeats)
    {
        cout << "Error: Not enough seats for all students!\n";
        return 1;
    }

    Queue studentQueue;
    inputStudents(studentQueue, numberOfStudents);

    int seats[100] = {0};
    Stack assignmentStack;
    int seatCount;
    assignSeats(studentQueue, seats, assignmentStack, seatCount, totalSeats);

    performUndo(assignmentStack, seats, seatCount, totalSeats);

    displaySeats(seats, totalSeats);

    cout << "Seat assignment history:\n";
    assignmentStack.display();

    cout << "--- Program End ---\n";
    return 0;
}