<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
    xmlns:r="http://xml.di.uminho.pt/report2007"
    xmlns:p="http://xml.di.uminho.pt/paragraph2007">
    
    <xsl:template name="bodypages">
        <xsl:apply-templates select="r:report/body"/>
    </xsl:template>
    
    <xsl:template match="chapter">
        <div class="w3-container w3-section">
            <a name="{generate-id()}"/>
            <xsl:call-template name="nav-bar"/>
                <xsl:apply-templates/>
            <xsl:call-template name="nav-bar"/>
        </div>
    </xsl:template>
    
    <xsl:template match="chapter/title">
        <header class="w3-light-grey">
            <h2>
                <a name="{generate-id()}"/>
                <xsl:number count="chapter" level="multiple"/>
                <xsl:text>. </xsl:text>
                <xsl:apply-templates/>
            </h2>
        </header>
    </xsl:template>
    
    <xsl:template match="chapter/section/title">
        <h2>
            <a name="{generate-id()}"/>
            <xsl:number count="chapter|section" level="multiple"/>
            <xsl:text>. </xsl:text>
            <xsl:apply-templates/>
        </h2>
    </xsl:template>
    
    <xsl:template match="chapter/section/subsection/title">
        <h3>
            <a name="{generate-id()}"/>
            <xsl:number count="chapter|section|subsection" level="multiple"/>
            <xsl:text>. </xsl:text>
            <xsl:apply-templates/>
        </h3>
    </xsl:template>
    
    <xsl:template match="subsubsection/title">
        <h4>
            <a name="{generate-id()}"/>
            <xsl:number count="chapter|section|subsection|subsubsection" level="multiple"/>
            <xsl:text>. </xsl:text>
            <xsl:apply-templates/>
        </h4>
    </xsl:template>
    
    <xsl:template name="nav-bar">
        <div class="navbar" align="justify">
            <div class="navbar-left" align="left">
                <xsl:if test="preceding-sibling::chapter">
                    <a href="#{generate-id(preceding-sibling::chapter[1])}">Anterior</a>
                </xsl:if>
            </div>
            <div class="navbar-center" align="center"><a href="#toc">Índice</a></div>
            <div class="navbar-right" align="right">
                <xsl:if test="following-sibling::chapter">
                    <a href="#{generate-id(following-sibling::chapter[1])}">Próximo</a>
                </xsl:if>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="codeblock">
        <pre class="codeblock">
            <xsl:value-of select="."/>
        </pre>
    </xsl:template>
    
    <xsl:template name="backpages">
        <xsl:apply-templates select="r:report/backmatter/bibliography"/>
    </xsl:template>
    
    <xsl:template match="bibliography">
        <div class="chapter">
            <xsl:call-template name="nav-bar"/>
            <h1>
                <a name="{generate-id()}"/>
                Bibliografia
            </h1>
            <dl>
                <xsl:apply-templates/>
            </dl>
            <xsl:call-template name="nav-bar"/>
        </div>
    </xsl:template>
    
    <xsl:template match="bibitem">
        <dt>
            <a name="{@id}"/>
            <xsl:value-of select="citkey"/>
        </dt>
        <dd>
            <xsl:value-of select="citation"/>
        </dd>
    </xsl:template>

</xsl:stylesheet>
