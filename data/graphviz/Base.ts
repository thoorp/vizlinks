

export class Base {
	
	protected  name:string;
	// in the case of cluster label holds the actual name of the entity
	protected  label:string;
	
	protected  url:string;
	
	protected  tooltip:string;
	
	protected  iconFont:string;
	
	protected  fontName:string;
	
	protected  fontColor:string;
	
	protected  fontSize:string;
	
	protected  shape:string;
	
	protected  style:string;
	
	protected  color:string;
	
	protected  highlight:boolean;
	
	protected  gradientAngle:string;
	public  static  VIZDOTSAPI_ROOT_URL:string = "/vizdotsapi/api/nodes/";
	public   static STYLE_INVIS:string = "invis";
	public   static COLOR_HIGHLIGHT:string = "#AF7817";

	
	
	public constructor( name:string,  label:string){
		this.name = name;
		this.label = label;
	}

	public  getName():string {
		return this.name;
	}

		public  getLabel():string {
		return this.label;
	}


	public  getColor():string {
		return this.color;
	}

	public  getFontColor():string {
		return this.fontColor;
	}

	public  getFontName():string {
		return this.fontName;
	}

	public  getFontSize():string {
		return this.fontSize;
	}

	public  getGradientAngle():string {
		return this.gradientAngle;
	}

	public  getIconFont():string {
		return this.iconFont;
	}

	

	public  getShape():string {
		return this.shape;
	}

	public  getStyle():string {
		return this.style;
	}

	public  getUrl():string {
		return this.url;
	}

	public  isHighlight():boolean {
		return this.highlight;
	}

	public  setColor( color:string) {
		this.color = color;
	}

	public  setFontColor( fontColor:string) {
		this.fontColor = fontColor;
	}

	public  setFontName(fontName:string) {
		this.fontName = fontName;
	}

	public  setFontSize( fontSize:string) {
		this.fontSize = fontSize;
	}

	public  setGradientAngle( gradientAngle:string) {
		this.gradientAngle = gradientAngle;
	}

	public  setHighlight( highlight:boolean) {
		this.highlight = highlight;
	}

	public  setIconFont( iconFont:string) {
		this.iconFont = iconFont;
	}

	public  setLabel( label:string) {
		this.label = label;
	}
	
	public  setName( name:string) {
		this.name = name;
	}

	public  setShape( shape:string) {
		this.shape = shape;
	}

	public  setStyle( style:string) {
		this.style = style;
	}

	public  setUrl( uRL:string) {
		this.url = uRL;
	}


}