#Programmed Design Documentation
HTML documentation template for the course Programmed Design at the HfG Schwäbisch Gmünd.

## Handling
This frameworks generates a web documentation from a folders and files. You can create multiple chapters where each must have a headline and an introduction text and might contain several sections. A section could be one of these:
- text only
- text and image
- text and processing sketch

### Folder structure 
To achieve this, the folders and files have to be in the folder 'content' and named in the following way:
* 1
  - headline.txt
  - text.txt
  - 1.png
  - 1.txt
  - 2.pde
  - 2.txt
  - 3.txt
  - ...
* 2
  - ...
* 3 
  - ...
* ...


### Text files
In most cases it doesn't hurt if a text file misses or is empty, except for the headline.txt, because this is used to build the menu.

Text files have to be saved in Unicode format. If some of the special characters you're using are not displayed correctly, check the preferences of your text editor and switch to the correct output format.


If you want to explain some parts of the code of your processing sketches, you can use the `<code>` tag to start a code block and `</code>` to end it. 
```html
<code>
for (float i=0; i<10; i++) {
  ellipse(i*30, 300, 10, 10);
}
</code>
```


## Helping out
If you have any suggestions or encounter bugs, please feel free to tell us in the issues section.
