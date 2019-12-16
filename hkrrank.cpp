#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>

using namespace std;

int main()
{
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    int t,i,j,k,L,N,M,Q,p,flag;
    scanf("%d", &t);
    int T[t] = {0};
    for (i = 0; i < t; i++)
    {
        int c = 0;
        scanf("%d %d %d",&N,&M,&Q);
        int P[M], R[Q] , U[Q];
        for (j = 0; j < M; i++)
        {
            scanf("%d", P[i]);
        }

        for (j = 0; j < Q; i++)
        {
            scanf("%d", R[i]);
        }

        for (j = 0; j < Q; j++)
        {
            for (k = 0; k < N; k++)
            {
                p = k;
                flag = 0;
                for (L = 0; L < M; L++)
                {
                    if (P[L] == p)
                    {
                        flag++;
                    }
                }
                if (flag != 0)
                {
                    break;
                }
                if (k % R[j] == 0)
                {
                    c++;
                }
            }
        }
        T[i]=c;
    }
    for(i=0;i<t;i++){
        printf("%d\n",T[i]);
    }

    return 0;
}


