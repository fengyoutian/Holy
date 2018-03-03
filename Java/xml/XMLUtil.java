package com.holy.xml;

import java.util.Iterator;
import java.util.Set;

import org.dom4j.Attribute;
import org.dom4j.Element;

/**
 * XML 工具类
 * 
 * @author fengyoutian
 */
public class XMLUtil {
	
	/**
	 * 检查节点是否存在
	 * 
	 * @param parentNode		检查节点的父节点
	 * @param elementName		检查节点名称
	 * @param value				检查节点name的value
	 * @return
	 */
	public static Element checkElement(Element parentNode, String elementName, String value) {
		Iterator<?> iterator = parentNode.elementIterator(elementName);
		while (iterator.hasNext()) {
			Element element = (Element) iterator.next();
			// 只取android:name的值
			if (null != element && value.equals(getValueByElement(element))) {
				return element;
			}
		}
		return null;
	}
	
	/**
	 * 从Element的attributeName中获取value
	 * 
	 * @param element
	 * @param attributeName
	 * @return
	 */
	public static String getAttributeByElement(Element element, String attributeName) {
		Iterator<?> iterator = element.attributeIterator();
		while (iterator.hasNext()) {
			Attribute attr = (Attribute) iterator.next();
			if (attributeName.equals(attr.getName())) {
				return attr.getValue();
			}
		}
		return null;
	}
	
	/**
	 * 从Element的name中获取value
	 * 
	 * @param element
	 * @return
	 */
	public static String getValueByElement(Element element) {
		Attribute attr = element.attribute("name");
		if (null != attr) {
			return attr.getValue();
		}
		
		return null;
	}
	
	/**
	 * 将set中的节点添加到element中
	 * 
	 * @param set			element数组
	 * @param element		宿主element
	 * @param elementName	元素名
	 */
	public static void addElement(Set<Element> set, Element element, String elementName) {
		for (Element e : set) {
			if (null == XMLUtil.checkElement(element, elementName, getValueByElement(e))) {
				element.add(e.createCopy());
			}
		}
	}
}
