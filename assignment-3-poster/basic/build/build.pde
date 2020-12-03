/* 

  Columns 
  
  Placing letters within a column and 
  with random text size.

*/

float tileSize = 7; // Size of grid tile

color PGRAPHICS_COLOR = color(0); //Constant black color 

color [] cp = {#ABADC8, #0F5DAC, #79E0F8, #7C7C7C, #C5B226, #344C5C, #041D1A, #37494A, #362CE6};

PGraphics pg;    // Text layer
PFont regularFont, boldFont; // Font variables
int margin = 35; // margin2 for event info
int margin2 = 100; // margin2 for event title

String name = "EMDASH DIGITAL";


void setup() {     // This runs only once
  size(720,900);   // Canvas size
  regularFont = createFont("VioletSans-Regular.otf",15); 
  noStroke();      // No strokes on shapes
  background(0); // Random RGB value with a 12 to 25 percent opacity
  fill(255); 
  textFont(regularFont);
  textAlign(CENTER,CENTER);
  
  //textSize(random(50,150));
  //text("T",random(0,width/4),random(margin2,height/2));
  //textSize(random(50,150));
  //text("Y",random(width/4,width/3),random(margin2,height/2));
  //textSize(random(50,150));
  //text("P",random(width/3,width/2),random(margin2,height/2));
  //textSize(random(50,150));
  //text("E",random(width/2,width),random(margin2,height/2));
  
  //textSize(random(50,150));
  //text("C",random(0,width/4),random(height/2,height-margin2));
  //textSize(random(50,150));
  //text("O",random(width/4,width/3),random(height/2,height-margin2));
  //textSize(random(50,150));
  //text("D",random(width/3,width/2),random(height/2,height-margin2));
  //textSize(random(50,150));
  //text("E",random(width/2,width),random(height/2,height-margin2));

  textLayer();
  int toggle  = 0;

  for (int i = 0; i < width;i += tileSize) {
    for (int j = 0; j < height; j += tileSize) {
      color c = pg.get(i,j); // Get the colour at each tile of the grid
      boolean isInsideText = (c == PGRAPHICS_COLOR); // Binary variable to evaulate if the text layer color matches black
       fill(255);
      if (isInsideText) { // If the binary variable is true, then do the following:
        if (toggle == 0 ) { // If zero is chosen:
          ellipse(i,j,6,6); 
          //ellipse(i,j,random(4,6),random(4,6)); // Draw an ellipse 
        } else if (toggle == 1 ){ // If one is chosen:
          //rect(i,j,6,6); 
          rect(i,j,random(4,6),random(4,6)); // Draw a rectangle 
        } else if (toggle == 2 ){ // If two is chosen:
          pushMatrix(); // Start transformation
          translate(i,j); // Move to the position of each tile
          //triangle(-3,3,3,3,0,-3); 
          triangle(random(-3,-1),random(1,3),random(1,3),random(1,3),0,random(-3,-1));
          popMatrix(); // End transformation
        } 
      }
    }
  }
    int dashTileSize = 30;
    fill(150);
    for (int i = 10; i < width;i += dashTileSize) {
    for (int j = 0; j < 740; j += dashTileSize) {
       color c = pg.get(i,j); // Get the colour at each tile of the grid
      boolean isInsideText = (c == PGRAPHICS_COLOR); // Binary variable to evaulate if the text layer color matches black
      if(!isInsideText) {
          rect(i,j, 10, 4);
      }
    }
  }
  fill(255);
   textFont(regularFont);            
  textAlign(LEFT,TOP);                    // Align text to left and top 
  textSize(25);
  text("New digital design duo based in Toronto, Canada", margin, 760);
  text("emdash.digital", margin, 800);
  text("contact@emdash.digital", margin, 840);

}

/* 
Creating a function for the underlying 
form for your generative type. 
*/

void textLayer() {
  pg = createGraphics(width,height); // Create layer the size of canvas
  pg.beginDraw();        // Start drawing
  pg.background(200);    // White background
  pg.fill(0); // Randomly select value from colour palette
  pg.textFont(regularFont); // Set font to Fedra Mono Bold
  //pg.textSize(400);      // Set font size to 400
  //pg.textAlign(CENTER,CENTER); // Horizontally and vertically align text
  //pg.text("AAA",random(margin,pg.width-margin),random(margin,pg.height-margin)); // Randomply place '+' horizontally and vertically
  pg.textFont(regularFont);            
  pg.textAlign(LEFT,TOP);                    // Align text to left and top 
  pg.textSize(random(100,150));
  float xOffset = random(margin, 400);
  float yOffset = random(margin, 400);
  pg.text("EMDASH",xOffset + random(-100, 0), yOffset + random(20,150));      
  pg.text("DIGITAL", xOffset + random(-100,0), yOffset + random(150,300));     
  pg.endDraw();          // End drawing
  //image(pg,0,0);
}
