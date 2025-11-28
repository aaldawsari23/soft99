#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def is_bike(product):
    """Check if product is a motorcycle/bike"""
    return (product.get('type') == 'bike' or
            product.get('category_id') == 'motorcycles')

def shorten_oil_description(product):
    """Generate short description for oil products (10-12 words)"""
    specs = product.get('specifications', {})
    brand = specs.get('manufacturer', '')
    volume = specs.get('volume', '')
    viscosity = specs.get('viscosity', '')
    oil_type_en = specs.get('oil_type', '')

    # Map oil type to Arabic
    oil_type_map = {
        'Synthetic': 'صناعي',
        'Semi-Synthetic': 'شبه صناعي',
        'Mineral': 'معدني'
    }
    oil_type = oil_type_map.get(oil_type_en, oil_type_en)

    # Extract product line from name (e.g., "7100", "300V", "5100")
    name = product.get('name', '')

    if brand == 'Motul':
        if viscosity:
            return f"زيت موتول {viscosity} {oil_type} حجم {volume} للدراجات النارية"
        else:
            return f"زيت موتول {oil_type} حجم {volume} للدراجات النارية"
    elif brand == 'Suzuki':
        return f"زيت سوزوكي {oil_type} حجم {volume} للدراجات النارية"
    elif brand == 'Castrol':
        if viscosity:
            return f"زيت كاسترول {viscosity} {oil_type} حجم {volume} للدراجات"
        else:
            return f"زيت كاسترول {oil_type} حجم {volume} للدراجات"
    else:
        return f"زيت {brand} {oil_type} حجم {volume} للدراجات النارية"

def shorten_filter_description(product):
    """Generate short description for filter products"""
    specs = product.get('specifications', {})
    brand = specs.get('manufacturer', '')
    model = specs.get('model', '')
    filter_type = specs.get('filter_type', '')
    compatibility = specs.get('compatibility', '')

    if 'زيت' in product.get('name', ''):
        if compatibility:
            return f"فلتر زيت {brand} {model} متوافق مع {compatibility}"
        else:
            return f"فلتر زيت {brand} {model} للدراجات النارية"
    elif 'هواء' in product.get('name', ''):
        if compatibility:
            return f"فلتر هواء {brand} {model} متوافق مع {compatibility}"
        else:
            return f"فلتر هواء {brand} {model} للدراجات النارية"
    else:
        return f"فلتر {brand} {model} للدراجات النارية"

def shorten_tire_description(product):
    """Generate short description for tire products"""
    specs = product.get('specifications', {})
    brand = specs.get('manufacturer', '')
    size = specs.get('size', '')
    tire_type = specs.get('tire_type', '')

    # Map tire type to Arabic
    type_map = {
        'Sport': 'رياضي',
        'Street': 'شارع',
        'Touring': 'سياحي',
        'Off-Road': 'طرق وعرة',
        'Racing': 'سباقات'
    }
    tire_type_ar = type_map.get(tire_type, tire_type)

    if tire_type_ar:
        return f"كفر {brand} {tire_type_ar} {size} للدراجات النارية"
    else:
        return f"كفر {brand} {size} للدراجات النارية"

def shorten_brake_description(product):
    """Generate short description for brake products"""
    specs = product.get('specifications', {})
    brand = specs.get('manufacturer', '')
    model = specs.get('model', '')
    material = specs.get('material', '')

    name = product.get('name', '')
    if 'فرامل' in name or 'تيل' in name:
        if material:
            return f"تيل فرامل {brand} {model} مادة {material}"
        else:
            return f"تيل فرامل {brand} {model} للدراجات النارية"
    elif 'ديسك' in name:
        return f"ديسك فرامل {brand} {model} للدراجات النارية"
    else:
        return f"قطع فرامل {brand} {model} للدراجات النارية"

def generate_short_description(product):
    """Generate appropriate short description based on category"""
    category_id = product.get('category_id', '')
    name = product.get('name', '')

    # Motorcycles - check first
    if is_bike(product):
        specs = product.get('specifications', {})
        brand = specs.get('manufacturer', '')
        model = specs.get('model', '')
        engine = specs.get('engine_capacity', '')

        if brand and model and engine:
            return f"دراجة {brand} {model} محرك {engine} موديل حديث"
        elif brand and model:
            return f"دراجة {brand} {model} موديل حديث"
        elif model:
            return f"دراجة نارية {model} موديل حديث"
        else:
            return f"دراجة نارية {name} موديل حديث"

    # Filter products - check before oil since "فلتر زيت" contains both
    elif category_id in ['c2', 'c3'] or 'فلتر' in name:
        return shorten_filter_description(product)

    # Oil products
    elif category_id == 'c1' or 'زيت' in name:
        return shorten_oil_description(product)

    # Tire products
    elif category_id == 'c4' or 'كفر' in name or 'إطار' in name:
        return shorten_tire_description(product)

    # Brake products
    elif category_id == 'c5' or 'فرامل' in name or 'تيل' in name:
        return shorten_brake_description(product)

    # Generic fallback
    else:
        specs = product.get('specifications', {})
        brand = specs.get('manufacturer', product.get('brand_id', ''))
        return f"{name} من {brand} للدراجات النارية"

def generate_long_description(product):
    """Generate long description (25-35 words for parts, 40-50 for bikes)"""
    category_id = product.get('category_id', '')
    name = product.get('name', '')
    specs = product.get('specifications', {})

    # For motorcycles/bikes - allow longer description
    if is_bike(product):
        brand = specs.get('manufacturer', '')
        model = specs.get('model', '')
        engine = specs.get('engine_capacity', '')
        power = specs.get('power', '')
        origin = specs.get('origin', '')

        # Build first sentence based on available data
        parts = []
        if brand:
            parts.append(f"دراجة {brand}")
        else:
            parts.append("دراجة نارية")

        if model:
            parts.append(model)

        if engine:
            parts.append(f"بمحرك {engine}")

        if power:
            parts.append(f"وقوة {power}")

        if origin:
            parts.append(f"مصنعة في {origin}")

        desc = " ".join(parts) + ". "
        desc += "تتميز بتصميم عصري وأداء رياضي متميز مع تقنيات حديثة للسلامة والراحة. "
        desc += "مناسبة للاستخدام اليومي والرحلات الطويلة."
        return desc

    # Filter products - check before oil
    elif category_id in ['c2', 'c3'] or 'فلتر' in name:
        brand = specs.get('manufacturer', '')
        origin = specs.get('origin', '')
        compatibility = specs.get('compatibility', '')

        if 'زيت' in name:
            desc = f"فلتر زيت {brand} من {origin} بترشيح دقيق لحماية المحرك. "
        elif 'هواء' in name:
            desc = f"فلتر هواء {brand} من {origin} لتنقية الهواء الداخل للمحرك. "
        else:
            desc = f"فلتر {brand} من {origin} بجودة عالية. "

        if compatibility:
            desc += f"متوافق مع {compatibility}."
        else:
            desc += "مناسب لمعظم الدراجات النارية."
        return desc

    # Oil products
    elif category_id == 'c1' or 'زيت' in name:
        brand = specs.get('manufacturer', '')
        viscosity = specs.get('viscosity', '')
        oil_type_en = specs.get('oil_type', '')
        origin = specs.get('origin', '')
        standard = specs.get('standard', '')

        oil_type_map = {
            'Synthetic': 'صناعي',
            'Semi-Synthetic': 'شبه صناعي',
            'Mineral': 'معدني'
        }
        oil_type = oil_type_map.get(oil_type_en, oil_type_en)

        if viscosity:
            desc = f"زيت {brand} {viscosity} {oil_type} من {origin} لمحركات 4 أشواط، "
        else:
            desc = f"زيت {brand} {oil_type} من {origin} لمحركات 4 أشواط، "

        desc += "يوفر حماية ممتازة ويقلل الاحتكاك. مناسب للاستخدام اليومي والرياضي الخفيف."
        return desc

    # Tire products
    elif category_id == 'c4' or 'كفر' in name:
        brand = specs.get('manufacturer', '')
        size = specs.get('size', '')
        tire_type = specs.get('tire_type', '')
        origin = specs.get('origin', '')

        type_map = {
            'Sport': 'رياضي',
            'Street': 'شارع',
            'Touring': 'سياحي',
            'Off-Road': 'طرق وعرة'
        }
        tire_type_ar = type_map.get(tire_type, tire_type)

        desc = f"كفر {brand} {tire_type_ar} مقاس {size} من {origin} بتصميم متطور. "
        desc += "يوفر قبضة ممتازة واستقرار عالي على الطرق المختلفة."
        return desc

    # Brake products
    elif category_id == 'c5' or 'فرامل' in name:
        brand = specs.get('manufacturer', '')
        material = specs.get('material', '')
        origin = specs.get('origin', '')

        if 'تيل' in name or 'فرامل' in name:
            desc = f"تيل فرامل {brand} من {origin} بمادة {material} عالية الجودة. "
            desc += "يوفر أداء فرملة قوي ومستقر في جميع الظروف."
        else:
            desc = f"قطع فرامل {brand} من {origin} بجودة أصلية. "
            desc += "توفر أمان وأداء موثوق للفرامل."
        return desc

    # Generic fallback
    else:
        brand = specs.get('manufacturer', '')
        origin = specs.get('origin', '')
        desc = f"منتج {brand} من {origin} بجودة عالية للدراجات النارية. "
        desc += "يوفر أداء موثوق ومتانة ممتازة."
        return desc

def update_products(input_file, output_file):
    """Main function to update products"""

    # Read the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        products = json.load(f)

    stats = {
        'total': len(products),
        'warranty_removed': 0,
        'warranty_kept': 0,
        'descriptions_updated': 0,
        'bikes': 0
    }

    # Process each product
    for product in products:
        product_is_bike = is_bike(product)

        # Count bikes
        if product_is_bike:
            stats['bikes'] += 1

        # Remove warranty from non-bike products
        if 'specifications' in product and 'warranty' in product['specifications']:
            if not product_is_bike:
                del product['specifications']['warranty']
                stats['warranty_removed'] += 1
            else:
                stats['warranty_kept'] += 1

        # Update descriptions
        try:
            # Generate new short description
            new_short_desc = generate_short_description(product)
            if new_short_desc and len(new_short_desc.split()) <= 15:  # Max 15 words
                product['short_description'] = new_short_desc

            # Generate new long description
            new_long_desc = generate_long_description(product)
            if new_long_desc:
                product['description'] = new_long_desc

            stats['descriptions_updated'] += 1
        except Exception as e:
            print(f"Error updating product {product.get('id', 'unknown')}: {e}")
            continue

    # Write updated products to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    return stats

if __name__ == '__main__':
    input_file = '/home/user/SoftNinetyNine/public/data/products.json'
    output_file = '/home/user/SoftNinetyNine/public/data/products.json'

    print("جاري تحديث المنتجات...")
    stats = update_products(input_file, output_file)

    print("\n=== نتائج التحديث ===")
    print(f"إجمالي المنتجات: {stats['total']}")
    print(f"عدد الدراجات النارية: {stats['bikes']}")
    print(f"تم حذف الضمان من: {stats['warranty_removed']} منتج")
    print(f"تم الاحتفاظ بالضمان في: {stats['warranty_kept']} دراجة نارية")
    print(f"تم تحديث الأوصاف لـ: {stats['descriptions_updated']} منتج")
    print("\nتم الحفظ بنجاح!")
