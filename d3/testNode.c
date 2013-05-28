#include <stdio.h>
#include <stdlib.h>
#include <string.h>  

int main(int argc, char *argv[])
{
    FILE* fichier = NULL;
 
	
	int node;
	char buffer[20] = "node";
	char buffer2[20];
	
	node = atoi(argv[1]);
	strcat(buffer, argv[1]);
	
    fichier = fopen("toto.json", "w");
 
    if (fichier != NULL)
    {
        // On peut lire et écrire dans le fichier
		int i;
		fputs("{\"nodes\": [", fichier);
		for(i = 0; i < node; i++)
		{	
			if(i !=0)
				fputs(", ", fichier);

			fputs("{", fichier);
			fputs("\"y\": ", fichier);
			sprintf(buffer2, "%d", i);
			fputs(buffer2, fichier);
			fputs(", \"descriptors\": \"node", fichier);
			fputs(buffer2, fichier);
			fputs("\"", fichier);	
			fputs(", \"x\": ", fichier);
			sprintf(buffer2, "%f", i/10);
			fputs(buffer2, fichier);
			fputs(", \"id\": ", fichier);
			sprintf(buffer2, "%d", i);
			fputs(buffer2, fichier);
			fputs(", \"label\": \"[label",fichier);
			fputs(buffer2, fichier);
			fputs("]\"}",fichier);
			
		}
		
		if(node != 1)
		{
		fputs("], ", fichier);
		fputs("\"links\": [", fichier);
		}

		for(i = 1; i < node; i++)
		{
			if(node != 1)
			{
			if(i > 1)
				fputs(", ", fichier);

			fputs("{\"source\": ", fichier);
			sprintf(buffer2, "%d", i);
			fputs(buffer2, fichier);
			fputs(", \"id\": ", fichier);
			sprintf(buffer2, "%d", i+node);
			fputs(buffer2, fichier);			
			fputs(", \"descriptors\": \"labellllll", fichier);
			sprintf(buffer2, "%d", i);
			fputs(buffer2, fichier);			
			fputs("\", \"target\": ", fichier);
			sprintf(buffer2, "%d", i-1);
			fputs(buffer2, fichier);
			fputs("}", fichier);
			}
			
		}

		fputs("]}", fichier);

		fclose(fichier); 
    }
    else
    {
        // On affiche un message d'erreur si on veut
        printf("Impossible d'ouvrir le fichier test.txt");
    }
 
    return 0;
}
